/**
 * MetricCard Component
 * Displays a single bloodwork metric with visual status indicator
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { BloodworkMetric } from '@/lib/validation';
import { getStatusColor, getStatusLabel, formatNumber, calculatePercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  metric: BloodworkMetric;
  index?: number;
}

export function MetricCard({ metric, index = 0 }: MetricCardProps): React.JSX.Element {
  const colors = getStatusColor(metric.status);
  const statusLabel = getStatusLabel(metric.status);
  
  // Calculate position in reference range for visual indicator
  const percentage = calculatePercentage(
    metric.value,
    metric.referenceRange.min,
    metric.referenceRange.max
  );

  // Determine trend icon
  const getTrendIcon = () => {
    if (metric.status === 'high' || metric.status === 'critical') {
      return <TrendingUp className="w-4 h-4" />;
    }
    if (metric.status === 'low') {
      return <TrendingDown className="w-4 h-4" />;
    }
    return <Minus className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        'rounded-xl border p-6 transition-all hover:shadow-lg',
        'bg-slate-900/50 backdrop-blur-sm',
        colors.border
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-200 mb-1">
            {metric.name}
          </h3>
          <p className="text-sm text-slate-400">{metric.category}</p>
        </div>
        
        {/* Status Badge */}
        <div className={cn('flex items-center gap-2 px-3 py-1 rounded-full', colors.bg)}>
          <div className={cn('w-2 h-2 rounded-full', colors.dot)} />
          <span className={cn('text-xs font-medium', colors.text)}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Value Display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-white">
            {formatNumber(metric.value)}
          </span>
          <span className="text-lg text-slate-400">{metric.unit}</span>
          <span className={cn('ml-auto', colors.text)}>
            {getTrendIcon()}
          </span>
        </div>
        
        {/* Reference Range */}
        <div className="text-sm text-slate-400">
          Reference: {formatNumber(metric.referenceRange.min)} - {formatNumber(metric.referenceRange.max)} {metric.unit}
        </div>
      </div>

      {/* Visual Range Indicator */}
      <div className="relative">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          {/* Reference range (green zone in middle) */}
          <div className="absolute inset-y-0 left-0 right-0 flex">
            {/* Below range */}
            <div className="flex-1 bg-blue-500/20" />
            {/* Normal range */}
            <div className="flex-1 bg-green-500/20" />
            {/* Above range */}
            <div className="flex-1 bg-orange-500/20" />
          </div>
          
          {/* Current value indicator */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.5, ease: 'easeOut' }}
            className="relative h-full"
          >
            <div className={cn('absolute right-0 top-0 w-1 h-full', colors.dot)} />
          </motion.div>
        </div>
        
        {/* Range labels */}
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>Low</span>
          <span>Normal</span>
          <span>High</span>
        </div>
      </div>
    </motion.div>
  );
}
