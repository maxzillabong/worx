/**
 * API Error Handling
 * Centralized error responses for consistent error handling
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ============================================================================
// Error Types
// ============================================================================

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================================
// Error Response Builder
// ============================================================================

export function createErrorResponse(
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
      },
    },
    { status: statusCode }
  );
}

// ============================================================================
// Error Handler
// ============================================================================

export function handleApiError(error: unknown): NextResponse {
  console.error('[API Error]', error);

  // Zod validation error
  if (error instanceof ZodError) {
    return createErrorResponse(
      400,
      'VALIDATION_ERROR',
      'Invalid request data',
      error.errors
    );
  }

  // Custom API error
  if (error instanceof ApiError) {
    return createErrorResponse(
      error.statusCode,
      error.code,
      error.message,
      error.details
    );
  }

  // Generic error
  if (error instanceof Error) {
    return createErrorResponse(500, 'INTERNAL_ERROR', error.message);
  }

  // Unknown error
  return createErrorResponse(500, 'UNKNOWN_ERROR', 'An unknown error occurred');
}

// ============================================================================
// Common Errors
// ============================================================================

export const Errors = {
  NotFound: (resource: string) =>
    new ApiError(404, 'NOT_FOUND', `${resource} not found`),

  Unauthorized: () =>
    new ApiError(401, 'UNAUTHORIZED', 'Authentication required'),

  Forbidden: () =>
    new ApiError(403, 'FORBIDDEN', 'Insufficient permissions'),

  BadRequest: (message: string) =>
    new ApiError(400, 'BAD_REQUEST', message),

  RateLimited: () =>
    new ApiError(429, 'RATE_LIMITED', 'Too many requests'),

  Internal: (message: string) =>
    new ApiError(500, 'INTERNAL_ERROR', message),
} as const;
