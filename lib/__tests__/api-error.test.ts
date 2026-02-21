/**
 * API Error Handling Tests
 * 
 * Tests for error utilities in lib/api-error.ts
 */

import { describe, it, expect } from 'vitest';
import { ApiError, createErrorResponse, handleApiError, Errors } from '../api-error';
import { ZodError } from 'zod';

describe('ApiError', () => {
  it('creates an ApiError with all properties', () => {
    const error = new ApiError(404, 'NOT_FOUND', 'Resource not found', { id: '123' });
    
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Resource not found');
    expect(error.details).toEqual({ id: '123' });
    expect(error.name).toBe('ApiError');
  });

  it('creates an ApiError without details', () => {
    const error = new ApiError(400, 'BAD_REQUEST', 'Invalid input');
    
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.message).toBe('Invalid input');
    expect(error.details).toBeUndefined();
  });
});

describe('createErrorResponse', () => {
  it('creates error response with correct structure', async () => {
    const response = createErrorResponse(404, 'NOT_FOUND', 'Resource not found');
    
    expect(response.status).toBe(404);
    
    // Parse response body
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toEqual({
      code: 'NOT_FOUND',
      message: 'Resource not found',
    });
  });

  it('includes details only in development mode', async () => {
    const details = { field: 'id', value: '123' };
    const response = createErrorResponse(400, 'VALIDATION_ERROR', 'Invalid field', details);
    
    const body = await response.json();
    
    // Details are only included when NODE_ENV === 'development'
    if (process.env.NODE_ENV === 'development') {
      expect(body.error.details).toEqual(details);
    } else {
      // In production/test, details should be omitted
      expect(body.error.details).toBeUndefined();
    }
  });
});

describe('handleApiError', () => {
  it('handles ZodError', async () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['name'],
        message: 'Expected string, received number',
      },
    ]);
    
    const response = handleApiError(zodError);
    
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toBe('Invalid request data');
  });

  it('handles ApiError', async () => {
    const apiError = new ApiError(404, 'NOT_FOUND', 'User not found');
    
    const response = handleApiError(apiError);
    
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toBe('User not found');
  });

  it('handles generic Error', async () => {
    const error = new Error('Something went wrong');
    
    const response = handleApiError(error);
    
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.code).toBe('INTERNAL_ERROR');
    expect(body.error.message).toBe('Something went wrong');
  });

  it('handles unknown error types', async () => {
    const unknownError = 'Unknown error string';
    
    const response = handleApiError(unknownError);
    
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.code).toBe('UNKNOWN_ERROR');
    expect(body.error.message).toBe('An unknown error occurred');
  });
});

describe('Errors', () => {
  it('creates NotFound error', () => {
    const error = Errors.NotFound('User');
    
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('User not found');
  });

  it('creates Unauthorized error', () => {
    const error = Errors.Unauthorized();
    
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.message).toBe('Authentication required');
  });

  it('creates Forbidden error', () => {
    const error = Errors.Forbidden();
    
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe('FORBIDDEN');
    expect(error.message).toBe('Insufficient permissions');
  });

  it('creates BadRequest error', () => {
    const error = Errors.BadRequest('Missing required field');
    
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.message).toBe('Missing required field');
  });

  it('creates RateLimited error', () => {
    const error = Errors.RateLimited();
    
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMITED');
    expect(error.message).toBe('Too many requests');
  });

  it('creates Internal error', () => {
    const error = Errors.Internal('Database connection failed');
    
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.message).toBe('Database connection failed');
  });
});
