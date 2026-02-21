/**
 * AI Analysis Module Tests
 *
 * Tests for prompt construction, JSON extraction, response parsing,
 * Anthropic API client, and the full analysis pipeline in lib/ai-analysis.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildAnalysisPrompt,
  extractJSON,
  parseAIResponse,
  callAnthropicAPI,
  analyzeBloodwork,
} from '../ai-analysis';
import { MOCK_BLOODWORK } from '../validation';

// ============================================================================
// Shared Fixtures
// ============================================================================

/** A valid AI response matching the expected schema */
const VALID_AI_RESPONSE = {
  insights: [
    {
      type: 'warning' as const,
      severity: 'medium' as const,
      title: 'Elevated White Blood Cells',
      description: 'Your WBC count is slightly above the normal reference range, which may indicate a mild infection or inflammatory response.',
      affectedMetrics: ['White Blood Cells'],
    },
    {
      type: 'warning' as const,
      severity: 'medium' as const,
      title: 'Elevated Glucose',
      description: 'Fasting glucose is above the normal range. This could indicate prediabetes or insulin resistance.',
      affectedMetrics: ['Glucose'],
    },
    {
      type: 'recommendation' as const,
      severity: 'low' as const,
      title: 'Monitor Cholesterol Levels',
      description: 'While your total cholesterol is within range, your LDL is approaching the upper limit. Consider dietary adjustments.',
      affectedMetrics: ['Cholesterol', 'LDL Cholesterol'],
    },
    {
      type: 'correlation' as const,
      severity: 'info' as const,
      title: 'Lipid Panel Overview',
      description: 'Your HDL-to-LDL ratio is reasonable but could be improved with regular exercise.',
      affectedMetrics: ['HDL Cholesterol', 'LDL Cholesterol', 'Triglycerides'],
    },
  ],
  summary: 'Overall bloodwork shows mostly normal values with elevated WBC and glucose requiring follow-up. This is not medical advice.',
};

const VALID_AI_RESPONSE_JSON = JSON.stringify(VALID_AI_RESPONSE);

// ============================================================================
// buildAnalysisPrompt
// ============================================================================

describe('buildAnalysisPrompt', () => {
  it('returns a non-empty string', () => {
    const prompt = buildAnalysisPrompt(MOCK_BLOODWORK);
    expect(prompt).toBeTruthy();
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(0);
  });

  it('includes all metric names in the prompt', () => {
    const prompt = buildAnalysisPrompt(MOCK_BLOODWORK);

    for (const metric of MOCK_BLOODWORK.metrics) {
      expect(prompt).toContain(metric.name);
    }
  });

  it('includes reference ranges and units for each metric', () => {
    const prompt = buildAnalysisPrompt(MOCK_BLOODWORK);

    for (const metric of MOCK_BLOODWORK.metrics) {
      expect(prompt).toContain(metric.unit);
      expect(prompt).toContain(String(metric.referenceRange.min));
      expect(prompt).toContain(String(metric.referenceRange.max));
    }
  });

  it('includes the test date', () => {
    const prompt = buildAnalysisPrompt(MOCK_BLOODWORK);
    expect(prompt).toContain(MOCK_BLOODWORK.testDate);
  });

  it('includes metric values', () => {
    const prompt = buildAnalysisPrompt(MOCK_BLOODWORK);

    for (const metric of MOCK_BLOODWORK.metrics) {
      expect(prompt).toContain(String(metric.value));
    }
  });

  it('includes metric statuses', () => {
    const prompt = buildAnalysisPrompt(MOCK_BLOODWORK);

    expect(prompt).toContain('status: normal');
    expect(prompt).toContain('status: high');
  });

  it('includes metric categories', () => {
    const prompt = buildAnalysisPrompt(MOCK_BLOODWORK);

    expect(prompt).toContain('Complete Blood Count');
    expect(prompt).toContain('Metabolic Panel');
    expect(prompt).toContain('Lipid Panel');
  });

  it('formats each metric as a list item', () => {
    const prompt = buildAnalysisPrompt(MOCK_BLOODWORK);

    // Each metric should start with "- MetricName:"
    for (const metric of MOCK_BLOODWORK.metrics) {
      expect(prompt).toContain(`- ${metric.name}:`);
    }
  });
});

// ============================================================================
// extractJSON
// ============================================================================

describe('extractJSON', () => {
  it('extracts raw JSON object starting with {', () => {
    const json = '{"key": "value"}';
    expect(extractJSON(json)).toBe(json);
  });

  it('extracts raw JSON with leading/trailing whitespace', () => {
    const json = '  \n  {"key": "value"}  \n  ';
    expect(extractJSON(json)).toBe('{"key": "value"}');
  });

  it('extracts from markdown code fences with json label', () => {
    const input = '```json\n{"insights": [], "summary": "test"}\n```';
    expect(extractJSON(input)).toBe('{"insights": [], "summary": "test"}');
  });

  it('extracts from markdown code fences without json label', () => {
    const input = '```\n{"insights": [], "summary": "test"}\n```';
    expect(extractJSON(input)).toBe('{"insights": [], "summary": "test"}');
  });

  it('extracts JSON embedded in surrounding text', () => {
    const input = 'Here is the analysis:\n{"key": "value"}\nEnd of analysis.';
    expect(extractJSON(input)).toBe('{"key": "value"}');
  });

  it('handles text before and after JSON with nested braces', () => {
    const input = 'Some text {"outer": {"inner": "val"}} more text';
    const result = extractJSON(input);
    expect(result).toBe('{"outer": {"inner": "val"}}');
  });

  it('throws on text with no JSON content', () => {
    expect(() => extractJSON('No JSON here at all')).toThrow(
      'No valid JSON found in AI response'
    );
  });

  it('throws on empty string', () => {
    expect(() => extractJSON('')).toThrow('No valid JSON found in AI response');
  });

  it('throws on text with only opening brace and no closing brace', () => {
    expect(() => extractJSON('just a { without close')).toThrow(
      'No valid JSON found in AI response'
    );
  });

  it('returns raw text when it starts with { even without closing brace', () => {
    // When text starts with {, extractJSON returns it directly without further checks
    const result = extractJSON('{incomplete');
    expect(result).toBe('{incomplete');
  });

  it('prioritizes code fence extraction over brace matching', () => {
    // When there's both a code fence and bare JSON, code fence should win
    const input = 'prefix {"wrong": true} ```json\n{"correct": true}\n``` suffix';
    // Code fence match should be used because the string doesn't start with {
    const result = extractJSON(input);
    expect(result).toBe('{"correct": true}');
  });
});

// ============================================================================
// parseAIResponse
// ============================================================================

describe('parseAIResponse', () => {
  it('parses a valid JSON response', () => {
    const result = parseAIResponse(VALID_AI_RESPONSE_JSON);

    expect(result.insights).toHaveLength(4);
    expect(result.summary).toBeTruthy();
    expect(result.insights[0].type).toBe('warning');
    expect(result.insights[0].severity).toBe('medium');
    expect(result.insights[0].title).toBe('Elevated White Blood Cells');
    expect(result.insights[0].affectedMetrics).toContain('White Blood Cells');
  });

  it('parses a response wrapped in markdown code fences', () => {
    const wrapped = '```json\n' + VALID_AI_RESPONSE_JSON + '\n```';
    const result = parseAIResponse(wrapped);

    expect(result.insights).toHaveLength(4);
    expect(result.summary).toBe(VALID_AI_RESPONSE.summary);
  });

  it('parses a response with surrounding text', () => {
    const wrapped = 'Here is my analysis:\n' + VALID_AI_RESPONSE_JSON + '\nEnd.';
    const result = parseAIResponse(wrapped);

    expect(result.insights).toHaveLength(4);
    expect(result.summary).toBe(VALID_AI_RESPONSE.summary);
  });

  it('throws on completely invalid JSON', () => {
    expect(() => parseAIResponse('this is not json at all')).toThrow();
  });

  it('throws on syntactically broken JSON', () => {
    expect(() => parseAIResponse('{broken json: true,}')).toThrow();
  });

  it('throws on empty insights array', () => {
    const response = JSON.stringify({
      insights: [],
      summary: 'Test summary',
    });

    expect(() => parseAIResponse(response)).toThrow();
  });

  it('throws on missing summary field', () => {
    const response = JSON.stringify({
      insights: [
        {
          type: 'warning',
          severity: 'high',
          title: 'Test',
          description: 'Test desc',
          affectedMetrics: ['Glucose'],
        },
      ],
    });

    expect(() => parseAIResponse(response)).toThrow();
  });

  it('throws on invalid type enum value', () => {
    const response = JSON.stringify({
      insights: [
        {
          type: 'invalid_type',
          severity: 'high',
          title: 'Test',
          description: 'Test desc',
          affectedMetrics: ['Glucose'],
        },
      ],
      summary: 'Test summary',
    });

    expect(() => parseAIResponse(response)).toThrow();
  });

  it('throws on invalid severity enum value', () => {
    const response = JSON.stringify({
      insights: [
        {
          type: 'warning',
          severity: 'critical',
          title: 'Test',
          description: 'Test desc',
          affectedMetrics: ['Glucose'],
        },
      ],
      summary: 'Test summary',
    });

    expect(() => parseAIResponse(response)).toThrow();
  });

  it('throws on empty affectedMetrics array', () => {
    const response = JSON.stringify({
      insights: [
        {
          type: 'warning',
          severity: 'high',
          title: 'Test',
          description: 'Test desc',
          affectedMetrics: [],
        },
      ],
      summary: 'Test summary',
    });

    expect(() => parseAIResponse(response)).toThrow();
  });

  it('throws on empty title', () => {
    const response = JSON.stringify({
      insights: [
        {
          type: 'warning',
          severity: 'high',
          title: '',
          description: 'Test desc',
          affectedMetrics: ['Glucose'],
        },
      ],
      summary: 'Test summary',
    });

    expect(() => parseAIResponse(response)).toThrow();
  });

  it('throws on empty description', () => {
    const response = JSON.stringify({
      insights: [
        {
          type: 'warning',
          severity: 'high',
          title: 'Test',
          description: '',
          affectedMetrics: ['Glucose'],
        },
      ],
      summary: 'Test summary',
    });

    expect(() => parseAIResponse(response)).toThrow();
  });

  it('throws on empty summary', () => {
    const response = JSON.stringify({
      insights: [
        {
          type: 'warning',
          severity: 'high',
          title: 'Test',
          description: 'Test desc',
          affectedMetrics: ['Glucose'],
        },
      ],
      summary: '',
    });

    expect(() => parseAIResponse(response)).toThrow();
  });
});

// ============================================================================
// callAnthropicAPI
// ============================================================================

describe('callAnthropicAPI', () => {
  const originalEnv = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    // Restore a known state for each test
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Restore the original env var
    if (originalEnv !== undefined) {
      process.env.ANTHROPIC_API_KEY = originalEnv;
    } else {
      delete process.env.ANTHROPIC_API_KEY;
    }
  });

  it('throws when ANTHROPIC_API_KEY is not set', async () => {
    delete process.env.ANTHROPIC_API_KEY;

    await expect(callAnthropicAPI('test prompt')).rejects.toThrow(
      'ANTHROPIC_API_KEY environment variable is not configured'
    );
  });

  it('calls fetch with correct URL, headers, and body', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key-123';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'response text' }],
        model: 'claude-sonnet-4-20250514',
        stop_reason: 'end_turn',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await callAnthropicAPI('Analyze this bloodwork');

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers['x-api-key']).toBe('test-api-key-123');
    expect(options.headers['anthropic-version']).toBe('2023-06-01');

    const body = JSON.parse(options.body);
    expect(body.model).toBe('claude-sonnet-4-20250514');
    expect(body.max_tokens).toBe(2048);
    expect(body.messages).toEqual([
      { role: 'user', content: 'Analyze this bloodwork' },
    ]);
  });

  it('returns text and model from a successful response', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key-123';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: VALID_AI_RESPONSE_JSON }],
        model: 'claude-sonnet-4-20250514',
        stop_reason: 'end_turn',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await callAnthropicAPI('test prompt');

    expect(result.text).toBe(VALID_AI_RESPONSE_JSON);
    expect(result.model).toBe('claude-sonnet-4-20250514');
  });

  it('throws on non-ok response with status and body', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key-123';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => '{"error": {"message": "Rate limit exceeded"}}',
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(callAnthropicAPI('test prompt')).rejects.toThrow(
      'AI analysis service is temporarily unavailable'
    );
  });

  it('throws on non-ok response and includes error body', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key-123';

    const errorBody = '{"error": {"message": "Invalid API key"}}';
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => errorBody,
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(callAnthropicAPI('test prompt')).rejects.toThrow(
      'AI analysis service is temporarily unavailable'
    );
  });

  it('throws when response contains no text content block', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key-123';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'tool_use', id: 'tool_123' }],
        model: 'claude-sonnet-4-20250514',
        stop_reason: 'tool_use',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(callAnthropicAPI('test prompt')).rejects.toThrow(
      'No text content in Anthropic API response'
    );
  });

  it('throws when response content array is empty', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key-123';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
        model: 'claude-sonnet-4-20250514',
        stop_reason: 'end_turn',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(callAnthropicAPI('test prompt')).rejects.toThrow(
      'No text content in Anthropic API response'
    );
  });
});

// ============================================================================
// analyzeBloodwork (full pipeline)
// ============================================================================

describe('analyzeBloodwork', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs the full pipeline: prompt -> API -> parse', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key-pipeline';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: VALID_AI_RESPONSE_JSON }],
        model: 'claude-sonnet-4-20250514',
        stop_reason: 'end_turn',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await analyzeBloodwork(MOCK_BLOODWORK);

    expect(result.insights).toHaveLength(4);
    expect(result.summary).toBe(VALID_AI_RESPONSE.summary);
    expect(result.model).toBe('claude-sonnet-4-20250514');

    // Verify the prompt was constructed from the bloodwork data
    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    const sentPrompt: string = body.messages[0].content;

    for (const metric of MOCK_BLOODWORK.metrics) {
      expect(sentPrompt).toContain(metric.name);
    }
  });

  it('propagates API errors from callAnthropicAPI', async () => {
    delete process.env.ANTHROPIC_API_KEY;

    await expect(analyzeBloodwork(MOCK_BLOODWORK)).rejects.toThrow(
      'ANTHROPIC_API_KEY environment variable is not configured'
    );
  });

  it('propagates parse errors when AI returns invalid JSON', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key-pipeline';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: 'This is not valid JSON at all' }],
        model: 'claude-sonnet-4-20250514',
        stop_reason: 'end_turn',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(analyzeBloodwork(MOCK_BLOODWORK)).rejects.toThrow();
  });

  it('handles markdown-wrapped API response in the pipeline', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-api-key-pipeline';

    const wrappedResponse = '```json\n' + VALID_AI_RESPONSE_JSON + '\n```';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: 'text', text: wrappedResponse }],
        model: 'claude-sonnet-4-20250514',
        stop_reason: 'end_turn',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await analyzeBloodwork(MOCK_BLOODWORK);

    expect(result.insights).toHaveLength(4);
    expect(result.summary).toBe(VALID_AI_RESPONSE.summary);
    expect(result.model).toBe('claude-sonnet-4-20250514');
  });
});
