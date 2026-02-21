/**
 * Dashboard Page
 *
 * Main dashboard displaying patient bloodwork results with AI-powered insights.
 * Light/dark theme aware — uses Tailwind dark: variants.
 */

'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Activity, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/metric-card';
import { AIInsightsPanel } from '@/components/ai-insights-panel';
import { WorkxLogo } from '@/components/worx-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { useWorxStore } from '@/lib/store';
import { MOCK_PATIENT, MOCK_BLOODWORK } from '@/lib/validation';
import { formatDate, groupMetricsByCategory, calculateSummaryStats } from '@/lib/utils';

export default function DashboardPage(): React.JSX.Element {
  const currentPatient = useWorxStore((state) => state.currentPatient);
  const bloodworkResults = useWorxStore((state) => state.bloodworkResults);
  const setCurrentPatient = useWorxStore((state) => state.setCurrentPatient);
  const addBloodworkResult = useWorxStore((state) => state.addBloodworkResult);

  useEffect(() => {
    if (!currentPatient) setCurrentPatient(MOCK_PATIENT);
    if (bloodworkResults.length === 0) addBloodworkResult(MOCK_BLOODWORK);
  }, [currentPatient, bloodworkResults, setCurrentPatient, addBloodworkResult]);

  const latestBloodwork = bloodworkResults[bloodworkResults.length - 1] ?? MOCK_BLOODWORK;
  const groupedMetrics = groupMetricsByCategory(latestBloodwork.metrics);
  const stats = calculateSummaryStats(latestBloodwork.metrics);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Top nav */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white gap-2 -ml-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-5 bg-slate-200 dark:bg-slate-700" />
            <WorkxLogo size={20} withWordmark />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 text-xs font-normal">
              Demo Mode
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blood Analysis Report</h1>
          <p className="text-slate-500 text-sm mt-1">AI-powered insights from your latest lab results</p>
        </motion.div>

        {/* Patient Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
        >
          <Card className="p-5 mb-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-none">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              <PatientInfoItem
                icon={<User className="w-4 h-4 text-slate-400" />}
                label="Patient"
                value={`${currentPatient?.firstName ?? '—'} ${currentPatient?.lastName ?? ''}`}
              />
              <PatientInfoItem
                icon={<Calendar className="w-4 h-4 text-slate-400" />}
                label="Test Date"
                value={formatDate(latestBloodwork.testDate)}
              />
              <PatientInfoItem
                icon={<Activity className="w-4 h-4 text-slate-400" />}
                label="Laboratory"
                value={latestBloodwork.labName ?? 'Unknown'}
              />
              <PatientInfoItem
                icon={<TrendingUp className="w-4 h-4 text-slate-400" />}
                label="Abnormal Results"
                value={`${stats.abnormal + stats.critical} of ${stats.total}`}
              />
            </div>
          </Card>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          <StatCard label="Normal" value={stats.normal} color="teal" />
          <StatCard label="Out of Range" value={stats.abnormal} color="amber" />
          <StatCard label="Critical" value={stats.critical} color="red" />
          <StatCard label="Total Metrics" value={stats.total} color="slate" />
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — Bloodwork results */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(groupedMetrics).map(([category, metrics], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + categoryIndex * 0.08, duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{category}</h2>
                  <Separator className="flex-1 bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs text-slate-400">
                    {metrics.length} {metrics.length === 1 ? 'test' : 'tests'}
                  </span>
                </div>
                <div className="grid gap-3">
                  {metrics.map((metric, index) => (
                    <MetricCard
                      key={metric.name}
                      metric={metric}
                      index={categoryIndex * 10 + index}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right — AI Insights */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="sticky top-20 space-y-4"
            >
              <AIInsightsPanel bloodwork={latestBloodwork} />

              <Card className="p-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-none">
                <div className="flex gap-3">
                  <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-500 leading-relaxed">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Demo data only.</span>{" "}
                    All values shown are synthetic and for demonstration purposes.
                    This is not medical advice.
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-xs text-slate-400"
        >
          Built with Next.js 16 · TypeScript · Zod · Zustand · Framer Motion
        </motion.div>
      </div>
    </div>
  );
}

function PatientInfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "teal" | "amber" | "red" | "slate";
}) {
  const colorMap = {
    teal: {
      value: "text-teal-600 dark:text-teal-400",
      card: "border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/30",
    },
    amber: {
      value: "text-amber-600 dark:text-amber-400",
      card: "border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20",
    },
    red: {
      value: "text-red-600 dark:text-red-400",
      card: "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20",
    },
    slate: {
      value: "text-slate-700 dark:text-slate-300",
      card: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
    },
  };
  return (
    <Card className={`p-4 border shadow-none ${colorMap[color].card}`}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[color].value}`}>{value}</p>
    </Card>
  );
}
