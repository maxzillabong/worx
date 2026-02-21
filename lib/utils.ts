/**
 * Utility functions
 * Pure, reusable helper functions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BloodworkMetric } from './validation';

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with appropriate decimal places
 */
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

/**
 * Format a date to a readable string
 */
export function formatDate(dateString: string, includeTime: boolean = false): string {
  const date = new Date(dateString);
  
  if (includeTime) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Calculate percentage within a range
 */
export function calculatePercentage(
  value: number,
  min: number,
  max: number
): number {
  if (max === min) return 50; // Avoid division by zero
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/**
 * Get status color based on metric status
 */
export function getStatusColor(status: BloodworkMetric['status']): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'normal':
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/20',
        dot: 'bg-green-500',
      };
    case 'low':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20',
        dot: 'bg-blue-500',
      };
    case 'high':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/20',
        dot: 'bg-orange-500',
      };
    case 'critical':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
        dot: 'bg-red-500',
      };
  }
}

/**
 * Get status label
 */
export function getStatusLabel(status: BloodworkMetric['status']): string {
  switch (status) {
    case 'normal':
      return 'Normal';
    case 'low':
      return 'Below Range';
    case 'high':
      return 'Above Range';
    case 'critical':
      return 'Critical';
  }
}

/**
 * Group metrics by category
 */
export function groupMetricsByCategory(
  metrics: BloodworkMetric[]
): Record<string, BloodworkMetric[]> {
  return metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, BloodworkMetric[]>);
}

/**
 * Calculate summary statistics
 */
export function calculateSummaryStats(metrics: BloodworkMetric[]): {
  total: number;
  normal: number;
  abnormal: number;
  critical: number;
} {
  return metrics.reduce(
    (acc, metric) => {
      acc.total++;
      if (metric.status === 'normal') acc.normal++;
      if (metric.status === 'low' || metric.status === 'high') acc.abnormal++;
      if (metric.status === 'critical') acc.critical++;
      return acc;
    },
    { total: 0, normal: 0, abnormal: 0, critical: 0 }
  );
}

/**
 * Sleep utility for demos/animations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
