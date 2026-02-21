/**
 * Validation schemas using Zod
 * All API inputs and forms should validate against these schemas
 */

import { z } from 'zod';

// ============================================================================
// Bloodwork Data Schemas
// ============================================================================

export const BloodworkMetricSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive(),
  unit: z.string().min(1),
  status: z.enum(['normal', 'low', 'high', 'critical']),
  referenceRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  category: z.string(),
});

export const BloodworkResultSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  testDate: z.string().datetime(),
  metrics: z.array(BloodworkMetricSchema),
  labName: z.string().optional(),
  orderedBy: z.string().optional(),
});

export const PatientSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().date(),
  sex: z.enum(['male', 'female', 'other']),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// ============================================================================
// AI Analysis Schemas (for future Claude Code feature)
// ============================================================================

export const AIInsightSchema = z.object({
  id: z.string().uuid(),
  bloodworkId: z.string().uuid(),
  generatedAt: z.string().datetime(),
  insights: z.array(
    z.object({
      type: z.enum(['warning', 'recommendation', 'trend', 'correlation']),
      severity: z.enum(['info', 'low', 'medium', 'high']),
      title: z.string(),
      description: z.string(),
      affectedMetrics: z.array(z.string()),
    })
  ),
  summary: z.string(),
  model: z.string(), // e.g., "claude-sonnet-4"
});

// ============================================================================
// API Request/Response Schemas
// ============================================================================

export const AnalyzeBloodworkRequestSchema = z.object({
  bloodworkId: z.string().uuid(),
  includeHistorical: z.boolean().default(false),
});

export const AnalyzeBloodworkResponseSchema = z.object({
  success: z.boolean(),
  insights: AIInsightSchema.optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .optional(),
});

// ============================================================================
// Type Exports (inferred from Zod schemas)
// ============================================================================

export type BloodworkMetric = z.infer<typeof BloodworkMetricSchema>;
export type BloodworkResult = z.infer<typeof BloodworkResultSchema>;
export type Patient = z.infer<typeof PatientSchema>;
export type AIInsight = z.infer<typeof AIInsightSchema>;
export type AnalyzeBloodworkRequest = z.infer<typeof AnalyzeBloodworkRequestSchema>;
export type AnalyzeBloodworkResponse = z.infer<typeof AnalyzeBloodworkResponseSchema>;

// ============================================================================
// Mock Data (for development)
// ============================================================================

export const MOCK_PATIENT: Patient = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-15',
  sex: 'male',
  email: 'john.doe@example.com',
};

export const MOCK_BLOODWORK: BloodworkResult = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  patientId: MOCK_PATIENT.id,
  testDate: new Date().toISOString(),
  metrics: [
    {
      name: 'Red Blood Cells',
      value: 4.5,
      unit: 'M/μL',
      status: 'normal',
      referenceRange: { min: 4.2, max: 5.9 },
      category: 'Complete Blood Count',
    },
    {
      name: 'White Blood Cells',
      value: 7.2,
      unit: 'K/μL',
      status: 'high',
      referenceRange: { min: 4.0, max: 7.0 },
      category: 'Complete Blood Count',
    },
    {
      name: 'Hemoglobin',
      value: 14.2,
      unit: 'g/dL',
      status: 'normal',
      referenceRange: { min: 13.5, max: 17.5 },
      category: 'Complete Blood Count',
    },
    {
      name: 'Glucose',
      value: 105,
      unit: 'mg/dL',
      status: 'high',
      referenceRange: { min: 70, max: 100 },
      category: 'Metabolic Panel',
    },
    {
      name: 'Cholesterol',
      value: 195,
      unit: 'mg/dL',
      status: 'normal',
      referenceRange: { min: 0, max: 200 },
      category: 'Lipid Panel',
    },
    {
      name: 'HDL Cholesterol',
      value: 55,
      unit: 'mg/dL',
      status: 'normal',
      referenceRange: { min: 40, max: 200 },
      category: 'Lipid Panel',
    },
    {
      name: 'LDL Cholesterol',
      value: 120,
      unit: 'mg/dL',
      status: 'normal',
      referenceRange: { min: 0, max: 130 },
      category: 'Lipid Panel',
    },
    {
      name: 'Triglycerides',
      value: 100,
      unit: 'mg/dL',
      status: 'normal',
      referenceRange: { min: 0, max: 150 },
      category: 'Lipid Panel',
    },
  ],
  labName: 'LabCorp',
  orderedBy: 'Dr. Sarah Johnson',
};
