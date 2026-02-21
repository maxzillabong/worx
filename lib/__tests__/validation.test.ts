/**
 * Validation Schema Tests
 * 
 * Tests for Zod validation schemas in lib/validation.ts
 */

import { describe, it, expect } from 'vitest';
import {
  BloodworkMetricSchema,
  BloodworkResultSchema,
  PatientSchema,
  AIInsightSchema,
  AnalyzeBloodworkRequestSchema,
  MOCK_PATIENT,
  MOCK_BLOODWORK,
} from '../validation';

describe('BloodworkMetricSchema', () => {
  it('validates a correct metric', () => {
    const validMetric = {
      name: 'Red Blood Cells',
      value: 4.5,
      unit: 'M/μL',
      status: 'normal' as const,
      referenceRange: { min: 4.2, max: 5.9 },
      category: 'Complete Blood Count',
    };

    const result = BloodworkMetricSchema.safeParse(validMetric);
    expect(result.success).toBe(true);
  });

  it('rejects metric with negative value', () => {
    const invalidMetric = {
      name: 'Test',
      value: -1, // Invalid: must be positive
      unit: 'U',
      status: 'normal' as const,
      referenceRange: { min: 0, max: 10 },
      category: 'Test',
    };

    const result = BloodworkMetricSchema.safeParse(invalidMetric);
    expect(result.success).toBe(false);
  });

  it('rejects metric with invalid status', () => {
    const invalidMetric = {
      name: 'Test',
      value: 5,
      unit: 'U',
      status: 'invalid' as any, // Invalid status
      referenceRange: { min: 0, max: 10 },
      category: 'Test',
    };

    const result = BloodworkMetricSchema.safeParse(invalidMetric);
    expect(result.success).toBe(false);
  });

  it('rejects metric with empty name', () => {
    const invalidMetric = {
      name: '', // Invalid: min 1 character
      value: 5,
      unit: 'U',
      status: 'normal' as const,
      referenceRange: { min: 0, max: 10 },
      category: 'Test',
    };

    const result = BloodworkMetricSchema.safeParse(invalidMetric);
    expect(result.success).toBe(false);
  });
});

describe('BloodworkResultSchema', () => {
  it('validates MOCK_BLOODWORK', () => {
    const result = BloodworkResultSchema.safeParse(MOCK_BLOODWORK);
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUID format', () => {
    const invalidResult = {
      ...MOCK_BLOODWORK,
      id: 'not-a-uuid', // Invalid UUID
    };

    const result = BloodworkResultSchema.safeParse(invalidResult);
    expect(result.success).toBe(false);
  });

  it('rejects invalid datetime format', () => {
    const invalidResult = {
      ...MOCK_BLOODWORK,
      testDate: '2024-02-21', // Invalid: should be ISO datetime
    };

    const result = BloodworkResultSchema.safeParse(invalidResult);
    expect(result.success).toBe(false);
  });

  it('accepts optional fields', () => {
    const minimalResult = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      patientId: '550e8400-e29b-41d4-a716-446655440000',
      testDate: new Date().toISOString(),
      metrics: [],
      // labName and orderedBy are optional
    };

    const result = BloodworkResultSchema.safeParse(minimalResult);
    expect(result.success).toBe(true);
  });
});

describe('PatientSchema', () => {
  it('validates MOCK_PATIENT', () => {
    const result = PatientSchema.safeParse(MOCK_PATIENT);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const invalidPatient = {
      ...MOCK_PATIENT,
      email: 'not-an-email', // Invalid email
    };

    const result = PatientSchema.safeParse(invalidPatient);
    expect(result.success).toBe(false);
  });

  it('rejects invalid sex', () => {
    const invalidPatient = {
      ...MOCK_PATIENT,
      sex: 'unknown' as any, // Invalid: must be male/female/other
    };

    const result = PatientSchema.safeParse(invalidPatient);
    expect(result.success).toBe(false);
  });

  it('rejects empty first name', () => {
    const invalidPatient = {
      ...MOCK_PATIENT,
      firstName: '', // Invalid: min 1 character
    };

    const result = PatientSchema.safeParse(invalidPatient);
    expect(result.success).toBe(false);
  });

  it('rejects name over 100 characters', () => {
    const invalidPatient = {
      ...MOCK_PATIENT,
      firstName: 'A'.repeat(101), // Invalid: max 100 characters
    };

    const result = PatientSchema.safeParse(invalidPatient);
    expect(result.success).toBe(false);
  });
});

describe('AIInsightSchema', () => {
  it('validates a correct insight', () => {
    const validInsight = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      bloodworkId: '550e8400-e29b-41d4-a716-446655440001',
      generatedAt: new Date().toISOString(),
      insights: [
        {
          type: 'warning' as const,
          severity: 'high' as const,
          title: 'Elevated Glucose',
          description: 'Your glucose level is above normal range.',
          affectedMetrics: ['Glucose'],
        },
      ],
      summary: 'Overall health looks good with one area to monitor.',
      model: 'claude-sonnet-4',
    };

    const result = AIInsightSchema.safeParse(validInsight);
    expect(result.success).toBe(true);
  });

  it('rejects invalid insight type', () => {
    const invalidInsight = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      bloodworkId: '550e8400-e29b-41d4-a716-446655440001',
      generatedAt: new Date().toISOString(),
      insights: [
        {
          type: 'invalid' as any, // Invalid type
          severity: 'high' as const,
          title: 'Test',
          description: 'Test description',
          affectedMetrics: ['Test'],
        },
      ],
      summary: 'Test',
      model: 'claude-sonnet-4',
    };

    const result = AIInsightSchema.safeParse(invalidInsight);
    expect(result.success).toBe(false);
  });
});

describe('AnalyzeBloodworkRequestSchema', () => {
  it('validates a correct request', () => {
    const validRequest = {
      bloodworkId: '550e8400-e29b-41d4-a716-446655440001',
      includeHistorical: true,
    };

    const result = AnalyzeBloodworkRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it('applies default value for includeHistorical', () => {
    const request = {
      bloodworkId: '550e8400-e29b-41d4-a716-446655440001',
    };

    const result = AnalyzeBloodworkRequestSchema.safeParse(request);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.includeHistorical).toBe(false);
    }
  });

  it('rejects invalid UUID', () => {
    const invalidRequest = {
      bloodworkId: 'not-a-uuid',
      includeHistorical: false,
    };

    const result = AnalyzeBloodworkRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });
});
