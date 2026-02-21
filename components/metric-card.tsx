/**
 * MetricCard Component
 * Displays a single bloodwork metric with visual status indicator.
 * Light/dark theme aware.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { BloodworkMetric } from '@/lib/validation';
import { getStatusLabel, formatNumber, calculatePercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  metric: BloodworkMetric;
  index?: number;
}

const STATUS_STYLES: Record<
  string,
  { badge: string; dot: string; text: string; border: string; bar: string }
> = {
  normal: {
    badge: 'bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-900/60',
    dot: 'bg-teal-500 dark:bg-teal-400',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-900/40',
    bar: 'bg-teal-500 dark:bg-teal-400',
  },
  high: {
    badge: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50',
    dot: 'bg-amber-500 dark:bg-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/40',
    bar: 'bg-amber-500 dark:bg-amber-400',
  },
  low: {
    badge: 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50',
    dot: 'bg-sky-500 dark:bg-sky-400',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-200 dark:border-sky-900/40',
    bar: 'bg-sky-500 dark:bg-sky-400',
  },
  critical: {
    badge: 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50',
    dot: 'bg-red-500 dark:bg-red-400',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-900/40',
    bar: 'bg-red-500 dark:bg-red-400',
  },
};

const DEFAULT_STYLE = STATUS_STYLES.normal;

export function MetricCard({ metric, index = 0 }: MetricCardProps): React.JSX.Element {
  const style = STATUS_STYLES[metric.status] ?? DEFAULT_STYLE;
  const statusLabel = getStatusLabel(metric.status);

  const percentage = calculatePercentage(
    metric.value,
    metric.referenceRange.min,
    metric.referenceRange.max
  );

  const getTrendIcon = () => {
    if (metric.status === 'high' || metric.status === 'critical') return <TrendingUp className="w-4 h-4" />;
    if (metric.status === 'low') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={cn(
        'rounded-xl border p-5 bg-white dark:bg-slate-900 transition-all hover:shadow-sm dark:hover:bg-slate-900/80',
        style.border
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-0.5">{metric.name}</h3>
          <p className="text-xs text-slate-400">{metric.category}</p>
        </div>
        <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full', style.badge)}>
          <div className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
          <span className={cn('text-xs font-medium', style.text)}>{statusLabel}</span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(metric.value)}</span>
          <span className="text-sm text-slate-400">{metric.unit}</span>
          <span className={cn('ml-auto', style.text)}>{getTrendIcon()}</span>
        </div>
        <p className="text-xs text-slate-400">
          Ref: {formatNumber(metric.referenceRange.min)}–{formatNumber(metric.referenceRange.max)} {metric.unit}
        </p>
      </div>

      {/* Range bar */}
      <div>
        <div className="relative h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-sky-100 dark:bg-sky-900/30" />
            <div className="flex-1 bg-teal-100 dark:bg-teal-900/30" />
            <div className="flex-1 bg-amber-100 dark:bg-amber-900/30" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: index * 0.04 + 0.15, duration: 0.5, ease: 'easeOut' }}
            className="relative h-full"
          >
            <div className={cn('absolute right-0 top-0 w-0.5 h-full rounded-full', style.bar)} />
          </motion.div>
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-slate-400">
          <span>Low</span>
          <span>Normal</span>
          <span>High</span>
        </div>
      </div>
    </motion.div>
  );
}
