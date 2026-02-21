/**
 * AI Analysis Module
 *
 * Handles prompt construction for bloodwork analysis and parsing
 * of AI responses into structured AIInsight format.
 * Uses Anthropic Claude API for generating medical insights.
 */

import { z } from 'zod';
import type { BloodworkMetric, BloodworkResult } from './validation';

// ============================================================================
// Types
// ============================================================================

/** Single parsed insight from AI response */
export interface ParsedInsight {
  type: 'warning' | 'recommendation' | 'trend' | 'correlation';
  severity: 'info' | 'low' | 'medium' | 'high';
  title: string;
  description: string;
  affectedMetrics: string[];
}

/** Complete parsed AI response */
export interface ParsedAIResponse {
  insights: ParsedInsight[];
  summary: string;
}

// ============================================================================
// Validation Schema for AI Response
// ============================================================================

const InsightItemSchema = z.object({
  type: z.enum(['warning', 'recommendation', 'trend', 'correlation']),
  severity: z.enum(['info', 'low', 'medium', 'high']),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  affectedMetrics: z.array(z.string().min(1)).min(1),
});

const AIResponseSchema = z.object({
  insights: z.array(InsightItemSchema).min(1).max(20),
  summary: z.string().min(1).max(500),
});

// ============================================================================
// Prompt Construction
// ============================================================================

/**
 * Build a structured prompt for AI bloodwork analysis.
 * Formats metric data and instructions for consistent JSON output.
 */
export function buildAnalysisPrompt(bloodwork: BloodworkResult): string {
  const metricsText = bloodwork.metrics
    .map((m: BloodworkMetric) =>
      `- ${m.name}: ${m.value} ${m.unit} (status: ${m.status}, ref: ${m.referenceRange.min}-${m.referenceRange.max} ${m.unit}, category: ${m.category})`
    )
    .join('\n');

  return `You are a medical laboratory analyst AI. Analyze the following bloodwork results and provide structured insights.

Patient bloodwork from ${bloodwork.testDate}:
${metricsText}

Provide your analysis as a JSON object with this exact structure:
{
  "insights": [
    {
      "type": "warning" | "recommendation" | "trend" | "correlation",
      "severity": "info" | "low" | "medium" | "high",
      "title": "Short descriptive title",
      "description": "Detailed explanation",
      "affectedMetrics": ["Metric Name 1", "Metric Name 2"]
    }
  ],
  "summary": "Brief overall summary of the bloodwork analysis"
}

Rules:
- type "warning": for abnormal or critical values that need attention
- type "recommendation": for lifestyle or dietary suggestions
- type "trend": for patterns observed within the metrics
- type "correlation": for relationships between metrics (e.g., glucose and cholesterol)
- severity "high": critical values or urgent concerns
- severity "medium": values moderately out of range
- severity "low": minor deviations or general suggestions
- severity "info": general educational information
- affectedMetrics must contain the exact metric names from the input
- Generate 3-8 insights covering different types
- Focus on actionable, educational insights
- Include a correlation insight if related metrics exist

IMPORTANT: This is for demonstration purposes only. Include a note in the summary that this is not medical advice.

Respond with ONLY the JSON object, no additional text.`;
}

// ============================================================================
// Response Parsing
// ============================================================================

/**
 * Parse and validate the AI model's text response into structured insights.
 * Extracts JSON from the response, validates against schema.
 */
export function parseAIResponse(responseText: string): ParsedAIResponse {
  const jsonString = extractJSON(responseText);
  const parsed: unknown = JSON.parse(jsonString);
  return AIResponseSchema.parse(parsed);
}

/**
 * Extract a JSON object from text that may contain markdown code fences
 * or other surrounding text.
 */
export function extractJSON(text: string): string {
  const trimmed = text.trim();

  // Try direct parse first
  if (trimmed.startsWith('{')) {
    return trimmed;
  }

  // Extract from markdown code fences
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch?.[1]) {
    return codeBlockMatch[1].trim();
  }

  // Find first { to last }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error('No valid JSON found in AI response');
}

// ============================================================================
// Anthropic API Client
// ============================================================================

/** Message format for Anthropic API */
interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Anthropic API response content block */
interface AnthropicContentBlock {
  type: string;
  text?: string;
}

/** Anthropic API response structure */
interface AnthropicResponse {
  content: AnthropicContentBlock[];
  model: string;
  stop_reason: string;
}

/**
 * Call the Anthropic API to analyze bloodwork.
 * Uses Claude Sonnet for fast, high-quality analysis.
 */
export async function callAnthropicAPI(prompt: string): Promise<{ text: string; model: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not configured');
  }

  const messages: AnthropicMessage[] = [
    { role: 'user', content: prompt },
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages,
    }),
  });

  if (!response.ok) {
    // Log full error server-side but return a generic message to clients
    const errorBody = await response.text();
    console.error(`[Anthropic API] ${response.status}: ${errorBody}`);
    throw new Error('AI analysis service is temporarily unavailable');
  }

  const data = (await response.json()) as AnthropicResponse;

  const textBlock = data.content.find((block: AnthropicContentBlock) => block.type === 'text');
  if (!textBlock?.text) {
    throw new Error('No text content in Anthropic API response');
  }

  return {
    text: textBlock.text,
    model: data.model,
  };
}

/**
 * Full analysis pipeline: build prompt, call API, parse response.
 */
export async function analyzeBloodwork(bloodwork: BloodworkResult): Promise<{
  insights: ParsedInsight[];
  summary: string;
  model: string;
}> {
  const prompt = buildAnalysisPrompt(bloodwork);
  const { text, model } = await callAnthropicAPI(prompt);
  const parsed = parseAIResponse(text);

  return {
    insights: parsed.insights,
    summary: parsed.summary,
    model,
  };
}
