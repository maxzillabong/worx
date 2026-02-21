/**
 * POST /api/analyze - Generate AI-powered insights from bloodwork results
 * GET  /api/analyze - Retrieve previously generated insights
 *
 * Uses Anthropic Claude to analyze bloodwork metrics and return
 * structured health insights with severity classifications.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { handleApiError, Errors } from '@/lib/api-error';
import {
  AnalyzeBloodworkRequestSchema,
  MOCK_BLOODWORK,
  type AIInsight,
} from '@/lib/validation';
import { analyzeBloodwork } from '@/lib/ai-analysis';

// In-memory insight store (until database is added in Phase 3)
const insightStore = new Map<string, AIInsight>();

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const data = AnalyzeBloodworkRequestSchema.parse(body);

    // Fetch bloodwork — currently using mock data for demo
    const bloodwork =
      data.bloodworkId === MOCK_BLOODWORK.id ? MOCK_BLOODWORK : undefined;

    if (!bloodwork) {
      throw Errors.NotFound('Bloodwork');
    }

    // Call AI model for analysis
    const { insights, summary, model } = await analyzeBloodwork(bloodwork);

    // Build validated insight object
    const aiInsight: AIInsight = {
      id: crypto.randomUUID(),
      bloodworkId: data.bloodworkId,
      generatedAt: new Date().toISOString(),
      insights,
      summary,
      model,
    };

    // Persist in memory store
    insightStore.set(aiInsight.id, aiInsight);

    return NextResponse.json({
      success: true,
      data: aiInsight,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get('bloodworkId');

    if (!rawId) {
      throw Errors.BadRequest('bloodworkId query parameter is required');
    }

    const bloodworkId = z.string().uuid().parse(rawId);

    // Find insights for this bloodwork ID
    const results: AIInsight[] = [];
    for (const insight of insightStore.values()) {
      if (insight.bloodworkId === bloodworkId) {
        results.push(insight);
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
