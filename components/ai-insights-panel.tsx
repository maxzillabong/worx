/**
 * AI Insights Panel Component
 *
 * Displays AI-generated insights from bloodwork analysis.
 * Handles generate, loading, error, and display states.
 * Color-codes insights by severity and groups by type.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Link2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorxStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { BloodworkResult, AIInsight } from '@/lib/validation';

// ============================================================================
// Props & Types
// ============================================================================

interface AIInsightsPanelProps {
  bloodwork: BloodworkResult;
}

interface InsightItemData {
  type: 'warning' | 'recommendation' | 'trend' | 'correlation';
  severity: 'info' | 'low' | 'medium' | 'high';
  title: string;
  description: string;
  affectedMetrics: string[];
}

// ============================================================================
// Severity & Type Styling
// ============================================================================

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-900/50',
  },
  low: {
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-900/50',
  },
  medium: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/50',
  },
  high: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-900/50',
  },
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  warning: <AlertTriangle className="w-3.5 h-3.5" />,
  recommendation: <Lightbulb className="w-3.5 h-3.5" />,
  trend: <TrendingUp className="w-3.5 h-3.5" />,
  correlation: <Link2 className="w-3.5 h-3.5" />,
};

const TYPE_LABELS: Record<string, string> = {
  warning: 'Warning',
  recommendation: 'Recommendation',
  trend: 'Trend',
  correlation: 'Correlation',
};

const SEVERITY_LABELS: Record<string, string> = {
  info: 'Info',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

// ============================================================================
// Sub-components
// ============================================================================

function InsightCard({ insight, index }: { insight: InsightItemData; index: number }): React.JSX.Element {
  const [expanded, setExpanded] = useState<boolean>(false);
  const style = SEVERITY_STYLES[insight.severity] ?? SEVERITY_STYLES.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className={cn('rounded-lg border p-3', style.border, style.bg)}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-2">
          <span className={cn('mt-0.5 shrink-0', style.text)}>
            {TYPE_ICONS[insight.type]}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                {insight.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn('text-[10px] font-medium', style.text)}>
                {SEVERITY_LABELS[insight.severity]}
              </span>
              <span className="text-[10px] text-slate-400">
                {TYPE_LABELS[insight.type]}
              </span>
            </div>
          </div>
          <span className="text-slate-400 shrink-0 mt-0.5">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2 pl-6">
              {insight.description}
            </p>
            {insight.affectedMetrics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 pl-6">
                {insight.affectedMetrics.map((metric) => (
                  <span
                    key={metric}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AIInsightsPanel({ bloodwork }: AIInsightsPanelProps): React.JSX.Element {
  const isAnalyzing = useWorxStore((state) => state.isAnalyzing);
  const setIsAnalyzing = useWorxStore((state) => state.setIsAnalyzing);
  const addInsight = useWorxStore((state) => state.addInsight);
  const allInsights = useWorxStore((state) => state.insights);

  const [error, setError] = useState<string | null>(null);

  const insights = React.useMemo(
    () => allInsights.filter((i) => i.bloodworkId === bloodwork.id),
    [allInsights, bloodwork.id]
  );

  const latestInsight: AIInsight | undefined = insights[insights.length - 1];

  const handleAnalyze = useCallback(async (): Promise<void> => {
    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bloodworkId: bloodwork.id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message ?? 'Analysis failed');
      }

      addInsight(result.data as AIInsight);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [bloodwork.id, setIsAnalyzing, addInsight]);

  // ---- Loading state ----
  if (isAnalyzing) {
    return (
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-none">
        <div className="flex flex-col items-center text-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="mb-4"
          >
            <Loader2 className="w-8 h-8 text-teal-500 dark:text-teal-400" />
          </motion.div>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-1">
            Analyzing bloodwork
          </p>
          <p className="text-xs text-slate-400">This may take a moment...</p>
        </div>
      </Card>
    );
  }

  // ---- Empty state (no insights yet) ----
  if (!latestInsight) {
    return (
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-none">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                AI Blood Analysis
              </h2>
              <p className="text-xs text-slate-400">Powered by Claude</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-5">
            Get personalized insights, trend analysis, and health recommendations
            from your bloodwork results.
          </p>

          <ul className="space-y-2 mb-6">
            {[
              'Analyze patterns across all metrics',
              'Identify correlations and trends',
              'Personalized health recommendations',
            ].map((feat) => (
              <li
                key={feat}
                className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
              >
                <div className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />
                {feat}
              </li>
            ))}
          </ul>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            size="sm"
            className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white gap-2 shadow-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Insights
          </Button>

          <p className="mt-4 text-[11px] text-slate-400 text-center">
            Not medical advice — for demonstration only
          </p>
        </motion.div>
      </Card>
    );
  }

  // ---- Insights display state ----
  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-none">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          AI Insights
        </h2>
        <span className="ml-auto text-xs text-slate-400">
          {latestInsight.insights.length} found
        </span>
      </div>

      {/* Summary */}
      <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {latestInsight.summary}
        </p>
        <p className="text-[10px] text-slate-400 mt-1.5">
          Model: {latestInsight.model}
        </p>
      </div>

      {/* Insight cards */}
      <div className="space-y-2 mb-4">
        {latestInsight.insights.map((insight, index) => (
          <InsightCard
            key={`${insight.type}-${insight.title}`}
            insight={insight}
            index={index}
          />
        ))}
      </div>

      {/* Re-analyze button */}
      {error && (
        <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <Button
        onClick={handleAnalyze}
        variant="outline"
        size="sm"
        className="w-full gap-2 text-xs"
      >
        <RefreshCw className="w-3 h-3" />
        Re-analyze
      </Button>

      <p className="mt-3 text-[10px] text-slate-400 text-center">
        Not medical advice — for demonstration only
      </p>
    </Card>
  );
}
