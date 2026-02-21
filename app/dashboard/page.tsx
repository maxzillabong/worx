/**
 * Dashboard Page
 * 
 * Main dashboard displaying patient bloodwork results with AI-powered insights.
 * Demonstrates production-grade architecture:
 * - Zustand for global state management
 * - Zod-validated data types
 * - Responsive grid layout
 * - Smooth animations with Framer Motion
 * - Component composition patterns
 */

'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/metric-card';
import { AIInsightsPanel } from '@/components/ai-insights-panel';
import { useWorxStore } from '@/lib/store';
import { MOCK_PATIENT, MOCK_BLOODWORK } from '@/lib/validation';
import { formatDate, groupMetricsByCategory, calculateSummaryStats } from '@/lib/utils';

export default function DashboardPage(): React.JSX.Element {
  const currentPatient = useWorxStore((state) => state.currentPatient);
  const bloodworkResults = useWorxStore((state) => state.bloodworkResults);
  const setCurrentPatient = useWorxStore((state) => state.setCurrentPatient);
  const addBloodworkResult = useWorxStore((state) => state.addBloodworkResult);

  // Initialize demo data on mount
  useEffect(() => {
    if (!currentPatient) {
      setCurrentPatient(MOCK_PATIENT);
    }
    if (bloodworkResults.length === 0) {
      addBloodworkResult(MOCK_BLOODWORK);
    }
  }, [currentPatient, bloodworkResults, setCurrentPatient, addBloodworkResult]);

  // Get latest bloodwork result
  const latestBloodwork = bloodworkResults[bloodworkResults.length - 1] || MOCK_BLOODWORK;
  
  // Group metrics by category
  const groupedMetrics = groupMetricsByCategory(latestBloodwork.metrics);
  
  // Calculate summary statistics
  const stats = calculateSummaryStats(latestBloodwork.metrics);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Patient Dashboard
              </h1>
              <p className="text-slate-400">
                AI-powered blood analysis and health insights
              </p>
            </div>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
              🤖 Demo Mode
            </Badge>
          </div>
        </motion.div>

        {/* Patient Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="p-6 mb-8 bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Patient Name */}
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-full p-3">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Patient</p>
                  <p className="text-lg font-semibold text-white">
                    {currentPatient?.firstName} {currentPatient?.lastName}
                  </p>
                </div>
              </div>

              {/* Test Date */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-full p-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Test Date</p>
                  <p className="text-lg font-semibold text-white">
                    {formatDate(latestBloodwork.testDate)}
                  </p>
                </div>
              </div>

              {/* Lab */}
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-full p-3">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Lab</p>
                  <p className="text-lg font-semibold text-white">
                    {latestBloodwork.labName || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Status Summary */}
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-full p-3">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Abnormal Results</p>
                  <p className="text-lg font-semibold text-white">
                    {stats.abnormal + stats.critical} of {stats.total}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4 bg-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Normal</p>
                <p className="text-2xl font-bold text-green-400">{stats.normal}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </Card>

          <Card className="p-4 bg-orange-500/5 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Out of Range</p>
                <p className="text-2xl font-bold text-orange-400">{stats.abnormal}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-orange-500" />
            </div>
          </Card>

          <Card className="p-4 bg-red-500/5 border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Critical</p>
                <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
          </Card>

          <Card className="p-4 bg-purple-500/5 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Metrics</p>
                <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
              </div>
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Bloodwork Results */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(groupedMetrics).map(([category, metrics], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + categoryIndex * 0.1, duration: 0.5 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-white">{category}</h2>
                  <Separator className="flex-1 bg-slate-800" />
                  <span className="text-sm text-slate-400">
                    {metrics.length} {metrics.length === 1 ? 'test' : 'tests'}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4">
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

          {/* Right Column - AI Insights */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="sticky top-8"
            >
              <AIInsightsPanel bloodwork={latestBloodwork} />

              {/* Info Notice */}
              <Card className="mt-4 p-4 bg-blue-500/5 border-blue-500/20">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-300">
                    <p className="font-medium text-blue-300 mb-1">
                      Demo Data Notice
                    </p>
                    <p className="text-slate-400">
                      This dashboard uses mock patient data for demonstration purposes. 
                      All values and insights are fictitious.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-16 text-center text-slate-500 text-sm"
        >
          <p>
            Built with Next.js 15, TypeScript, Zod, Zustand, and Framer Motion
          </p>
          <p className="mt-2">
            AI Insights feature will be autonomously developed by Claude Code 4.6
          </p>
        </motion.div>
      </div>
    </div>
  );
}
