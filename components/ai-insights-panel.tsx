/**
 * AI Insights Panel Component
 *
 * Displays AI-generated insights from bloodwork analysis.
 * Currently shows empty/coming-soon state; ready for Phase 2 implementation.
 * Light/dark theme aware.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorxStore } from '@/lib/store';
import type { BloodworkResult } from '@/lib/validation';

interface AIInsightsPanelProps {
  bloodwork: BloodworkResult;
}

export function AIInsightsPanel({ bloodwork }: AIInsightsPanelProps): React.JSX.Element {
  const isAnalyzing = useWorxStore((state) => state.isAnalyzing);
  const allInsights = useWorxStore((state) => state.insights);
  const insights = React.useMemo(
    () => allInsights.filter((i) => i.bloodworkId === bloodwork.id),
    [allInsights, bloodwork.id]
  );

  const handleAnalyze = async () => {
    console.log('Analysis requested for bloodwork:', bloodwork.id);
  };

  if (insights.length === 0 && !isAnalyzing) {
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
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">AI Blood Analysis</h2>
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
              <li key={feat} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />
                {feat}
              </li>
            ))}
          </ul>

          <Button
            onClick={handleAnalyze}
            size="sm"
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700 gap-2 cursor-not-allowed shadow-none"
            disabled
          >
            <Lock className="w-3.5 h-3.5" />
            Generate Insights
            <span className="text-xs text-slate-400 ml-auto">Coming Soon</span>
          </Button>

          <p className="mt-4 text-[11px] text-slate-400 text-center">
            Being built by Claude Code 4.6 autonomously
          </p>
        </motion.div>
      </Card>
    );
  }

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
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-1">Analyzing bloodwork</p>
          <p className="text-xs text-slate-400">This may take a moment...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-none">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">AI Insights</h2>
        <span className="ml-auto text-xs text-slate-400">{insights.length} found</span>
      </div>
      <div className="text-xs text-slate-400">
        Insights display to be implemented in Phase 2.
      </div>
    </Card>
  );
}
