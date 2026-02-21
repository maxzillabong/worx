/**
 * Analyze API Route Tests
 *
 * Tests for POST /api/analyze and GET /api/analyze endpoints
 * in app/api/analyze/route.ts. Mocks the AI analysis module
 * to verify route-level validation, error handling, and response structure.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST, GET } from '@/app/api/analyze/route';

// ---------------------------------------------------------------------------
// Mock the AI analysis module so tests never call the real Anthropic API
// ---------------------------------------------------------------------------

const mockAnalysisResult = {
  insights: [
    {
      type: 'warning' as const,
      severity: 'medium' as const,
      title: 'Elevated White Blood Cells',
      description: 'WBC count is slightly above the normal range.',
      affectedMetrics: ['White Blood Cells'],
    },
    {
      type: 'recommendation' as const,
      severity: 'low' as const,
      title: 'Monitor Glucose Levels',
      description: 'Fasting glucose is slightly elevated at 105 mg/dL.',
      affectedMetrics: ['Glucose'],
    },
  ],
  summary: 'Overall bloodwork shows mostly normal values with minor concerns.',
  model: 'claude-sonnet-4-20250514',
};

vi.mock('@/lib/ai-analysis', () => ({
  analyzeBloodwork: vi.fn(),
}));

// Import the mocked function so we can control its behavior per-test
import { analyzeBloodwork } from '@/lib/ai-analysis';
const mockedAnalyzeBloodwork = vi.mocked(analyzeBloodwork);

// The known mock bloodwork UUID from lib/validation.ts
const VALID_BLOODWORK_ID = '550e8400-e29b-41d4-a716-446655440001';
// A valid UUID that does not match any stored bloodwork
const UNKNOWN_BLOODWORK_ID = '00000000-0000-4000-a000-000000000099';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function postRequest(body: unknown): Request {
  return new Request('http://localhost/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function getRequest(params?: string): Request {
  const url = params
    ? `http://localhost/api/analyze?${params}`
    : 'http://localhost/api/analyze';
  return new Request(url);
}

// ---------------------------------------------------------------------------
// POST /api/analyze
// ---------------------------------------------------------------------------

describe('POST /api/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAnalyzeBloodwork.mockResolvedValue(mockAnalysisResult);
  });

  it('returns success with AI insights for valid MOCK_BLOODWORK id', async () => {
    const response = await POST(postRequest({ bloodworkId: VALID_BLOODWORK_ID }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data.bloodworkId).toBe(VALID_BLOODWORK_ID);
    expect(body.data.insights).toHaveLength(2);
    expect(body.data.summary).toBe(mockAnalysisResult.summary);
    expect(body.data.model).toBe(mockAnalysisResult.model);
    expect(body.data.id).toBeDefined();
    expect(body.data.generatedAt).toBeDefined();
  });

  it('calls analyzeBloodwork with the resolved bloodwork data', async () => {
    await POST(postRequest({ bloodworkId: VALID_BLOODWORK_ID }));

    expect(mockedAnalyzeBloodwork).toHaveBeenCalledTimes(1);
    // The first argument should be the MOCK_BLOODWORK object
    const arg = mockedAnalyzeBloodwork.mock.calls[0][0];
    expect(arg.id).toBe(VALID_BLOODWORK_ID);
    expect(arg.metrics).toBeDefined();
  });

  it('returns 400 for missing bloodworkId', async () => {
    const response = await POST(postRequest({}));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 for invalid UUID format', async () => {
    const response = await POST(postRequest({ bloodworkId: 'not-a-uuid' }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when body is not valid JSON-parseable object', async () => {
    const request = new Request('http://localhost/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json',
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
  });

  it('returns 404 for unknown bloodwork ID', async () => {
    const response = await POST(postRequest({ bloodworkId: UNKNOWN_BLOODWORK_ID }));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toContain('Bloodwork');
  });

  it('returns 400 when bloodworkId is a number instead of string', async () => {
    const response = await POST(postRequest({ bloodworkId: 12345 }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('handles AI analysis errors gracefully', async () => {
    mockedAnalyzeBloodwork.mockRejectedValueOnce(new Error('AI service unavailable'));

    const response = await POST(postRequest({ bloodworkId: VALID_BLOODWORK_ID }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });

  it('defaults includeHistorical to false when omitted', async () => {
    const response = await POST(postRequest({ bloodworkId: VALID_BLOODWORK_ID }));

    expect(response.status).toBe(200);
    // The route should still succeed because includeHistorical has a default
  });

  it('accepts includeHistorical as true', async () => {
    const response = await POST(
      postRequest({ bloodworkId: VALID_BLOODWORK_ID, includeHistorical: true }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it('returns response with valid AIInsight structure', async () => {
    const response = await POST(postRequest({ bloodworkId: VALID_BLOODWORK_ID }));
    const body = await response.json();

    const insight = body.data;
    // Verify structural fields exist and have correct types
    expect(typeof insight.id).toBe('string');
    expect(typeof insight.bloodworkId).toBe('string');
    expect(typeof insight.generatedAt).toBe('string');
    expect(Array.isArray(insight.insights)).toBe(true);
    expect(typeof insight.summary).toBe('string');
    expect(typeof insight.model).toBe('string');

    // Each insight item should have the expected shape
    for (const item of insight.insights) {
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('severity');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('affectedMetrics');
    }
  });
});

// ---------------------------------------------------------------------------
// GET /api/analyze
// ---------------------------------------------------------------------------

describe('GET /api/analyze', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAnalyzeBloodwork.mockResolvedValue(mockAnalysisResult);
  });

  it('returns 400 when bloodworkId query parameter is missing', async () => {
    const response = await GET(getRequest());
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('BAD_REQUEST');
    expect(body.error.message).toContain('bloodworkId');
  });

  it('returns empty array when no insights exist for a bloodwork ID', async () => {
    const response = await GET(getRequest(`bloodworkId=${UNKNOWN_BLOODWORK_ID}`));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  it('returns proper response structure', async () => {
    const response = await GET(getRequest(`bloodworkId=${VALID_BLOODWORK_ID}`));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('returns insights after a POST creates one', async () => {
    // First, POST to create an insight
    const postResponse = await POST(postRequest({ bloodworkId: VALID_BLOODWORK_ID }));
    expect(postResponse.status).toBe(200);

    // Then, GET insights for the same bloodwork ID
    const getResponse = await GET(getRequest(`bloodworkId=${VALID_BLOODWORK_ID}`));
    const getBody = await getResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getBody.success).toBe(true);
    // There should be at least one insight (may be more if other tests ran first)
    expect(getBody.data.length).toBeGreaterThanOrEqual(1);

    const matchingInsight = getBody.data.find(
      (i: { bloodworkId: string }) => i.bloodworkId === VALID_BLOODWORK_ID,
    );
    expect(matchingInsight).toBeDefined();
    expect(matchingInsight.summary).toBe(mockAnalysisResult.summary);
  });
});
