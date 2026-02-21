/**
 * Utility Functions Tests
 * 
 * Tests for pure helper functions in lib/utils.ts
 */

import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatDate,
  calculatePercentage,
  getStatusColor,
  getStatusLabel,
  groupMetricsByCategory,
  calculateSummaryStats,
} from '../utils';
import type { BloodworkMetric } from '../validation';

describe('formatNumber', () => {
  it('formats number with default 1 decimal place', () => {
    expect(formatNumber(4.567)).toBe('4.6');
  });

  it('formats number with custom decimal places', () => {
    expect(formatNumber(4.567, 2)).toBe('4.57');
    expect(formatNumber(4.567, 0)).toBe('5');
  });

  it('handles whole numbers', () => {
    expect(formatNumber(42)).toBe('42.0');
  });
});

describe('formatDate', () => {
  it('formats date without time', () => {
    const date = '2024-02-21T10:30:00Z';
    const formatted = formatDate(date, false);
    expect(formatted).toContain('Feb');
    expect(formatted).toContain('21');
    expect(formatted).toContain('2024');
  });

  it('formats date with time', () => {
    const date = '2024-02-21T10:30:00Z';
    const formatted = formatDate(date, true);
    expect(formatted).toContain('Feb');
    expect(formatted).toContain('21');
    expect(formatted).toContain('2024');
  });
});

describe('calculatePercentage', () => {
  it('calculates percentage within range', () => {
    expect(calculatePercentage(5, 0, 10)).toBe(50);
    expect(calculatePercentage(7.5, 0, 10)).toBe(75);
    expect(calculatePercentage(2.5, 0, 10)).toBe(25);
  });

  it('clamps to 0-100 range', () => {
    expect(calculatePercentage(-5, 0, 10)).toBe(0);
    expect(calculatePercentage(15, 0, 10)).toBe(100);
  });

  it('handles equal min/max (avoids division by zero)', () => {
    expect(calculatePercentage(5, 5, 5)).toBe(50);
  });
});

describe('getStatusColor', () => {
  it('returns correct colors for normal status', () => {
    const colors = getStatusColor('normal');
    expect(colors.bg).toContain('green');
    expect(colors.text).toContain('green');
    expect(colors.border).toContain('green');
    expect(colors.dot).toContain('green');
  });

  it('returns correct colors for low status', () => {
    const colors = getStatusColor('low');
    expect(colors.bg).toContain('blue');
    expect(colors.text).toContain('blue');
  });

  it('returns correct colors for high status', () => {
    const colors = getStatusColor('high');
    expect(colors.bg).toContain('orange');
    expect(colors.text).toContain('orange');
  });

  it('returns correct colors for critical status', () => {
    const colors = getStatusColor('critical');
    expect(colors.bg).toContain('red');
    expect(colors.text).toContain('red');
  });
});

describe('getStatusLabel', () => {
  it('returns correct labels', () => {
    expect(getStatusLabel('normal')).toBe('Normal');
    expect(getStatusLabel('low')).toBe('Below Range');
    expect(getStatusLabel('high')).toBe('Above Range');
    expect(getStatusLabel('critical')).toBe('Critical');
  });
});

describe('groupMetricsByCategory', () => {
  it('groups metrics by category', () => {
    const metrics: BloodworkMetric[] = [
      {
        name: 'RBC',
        value: 4.5,
        unit: 'M/μL',
        status: 'normal',
        referenceRange: { min: 4.2, max: 5.9 },
        category: 'CBC',
      },
      {
        name: 'WBC',
        value: 7.0,
        unit: 'K/μL',
        status: 'normal',
        referenceRange: { min: 4.0, max: 11.0 },
        category: 'CBC',
      },
      {
        name: 'Glucose',
        value: 95,
        unit: 'mg/dL',
        status: 'normal',
        referenceRange: { min: 70, max: 100 },
        category: 'Metabolic',
      },
    ];

    const grouped = groupMetricsByCategory(metrics);

    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped['CBC']).toHaveLength(2);
    expect(grouped['Metabolic']).toHaveLength(1);
    expect(grouped['CBC'][0].name).toBe('RBC');
  });

  it('handles empty array', () => {
    const grouped = groupMetricsByCategory([]);
    expect(Object.keys(grouped)).toHaveLength(0);
  });
});

describe('calculateSummaryStats', () => {
  it('calculates correct statistics', () => {
    const metrics: BloodworkMetric[] = [
      {
        name: 'Test1',
        value: 5,
        unit: 'U',
        status: 'normal',
        referenceRange: { min: 0, max: 10 },
        category: 'Test',
      },
      {
        name: 'Test2',
        value: 5,
        unit: 'U',
        status: 'normal',
        referenceRange: { min: 0, max: 10 },
        category: 'Test',
      },
      {
        name: 'Test3',
        value: 5,
        unit: 'U',
        status: 'high',
        referenceRange: { min: 0, max: 10 },
        category: 'Test',
      },
      {
        name: 'Test4',
        value: 5,
        unit: 'U',
        status: 'low',
        referenceRange: { min: 0, max: 10 },
        category: 'Test',
      },
      {
        name: 'Test5',
        value: 5,
        unit: 'U',
        status: 'critical',
        referenceRange: { min: 0, max: 10 },
        category: 'Test',
      },
    ];

    const stats = calculateSummaryStats(metrics);

    expect(stats.total).toBe(5);
    expect(stats.normal).toBe(2);
    expect(stats.abnormal).toBe(2); // high + low
    expect(stats.critical).toBe(1);
  });

  it('handles empty array', () => {
    const stats = calculateSummaryStats([]);
    expect(stats).toEqual({
      total: 0,
      normal: 0,
      abnormal: 0,
      critical: 0,
    });
  });
});
