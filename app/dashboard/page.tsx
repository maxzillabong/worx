"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity,
  Droplet,
  Heart,
  Brain
} from "lucide-react";
import Link from "next/link";

// Fake patient data
const patientData = {
  name: "John Doe",
  age: 34,
  gender: "Male",
  lastTest: "2026-02-21",
};

// Bloodwork results with status
const bloodwork = [
  {
    name: "Red Blood Cells",
    value: "4.5",
    unit: "M/μL",
    range: "4.5 - 5.5",
    status: "normal",
    trend: "stable",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    icon: <Droplet className="w-5 h-5" />,
  },
  {
    name: "White Blood Cells",
    value: "7.2",
    unit: "K/μL",
    range: "4.0 - 11.0",
    status: "elevated",
    trend: "up",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    name: "Hemoglobin",
    value: "14.2",
    unit: "g/dL",
    range: "13.5 - 17.5",
    status: "normal",
    trend: "stable",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    name: "Blood Glucose",
    value: "105",
    unit: "mg/dL",
    range: "70 - 100",
    status: "prediabetic",
    trend: "up",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: <Brain className="w-5 h-5" />,
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4 hover:bg-purple-500/30 cursor-pointer">
              ← Back to Home
            </Badge>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-purple-200 mb-2">
                Blood Analysis Dashboard
              </h1>
              <p className="text-slate-400">
                Patient: {patientData.name}, {patientData.age}
                {patientData.gender[0]} • Last Test: {patientData.lastTest}
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Generate AI Insights
            </Button>
          </div>
        </div>

        {/* Bloodwork Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {bloodwork.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${metric.bgColor} border ${metric.borderColor} hover:${metric.borderColor.replace('/30', '/50')} transition-all`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={metric.color}>
                        {metric.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-purple-100">
                          {metric.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-xs">
                          Normal range: {metric.range} {metric.unit}
                        </CardDescription>
                      </div>
                    </div>
                    <TrendBadge trend={metric.trend} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className={`text-4xl font-bold ${metric.color}`}>
                      {metric.value}
                    </span>
                    <span className="text-slate-400 text-sm">{metric.unit}</span>
                  </div>
                  <StatusBadge status={metric.status} />
                  <Progress 
                    value={getProgressValue(metric.value, metric.range)}
                    className="mt-4 h-2"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Insights Placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-200">AI Health Insights</CardTitle>
              <CardDescription className="text-slate-400">
                Click &quot;Generate AI Insights&quot; above to get personalized health recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center">
                <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">
                  AI analysis will appear here...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-slate-500 text-sm"
        >
          <p>
            🤖 This dashboard is part of a 100% AI-generated project.{" "}
            <Link href="/how-it-was-made" className="text-purple-400 hover:underline">
              Learn how it was built
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function TrendBadge({ trend }: { trend: string }) {
  const icons = {
    up: <TrendingUp className="w-3 h-3" />,
    down: <TrendingDown className="w-3 h-3" />,
    stable: <Minus className="w-3 h-3" />,
  };

  const colors = {
    up: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    down: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    stable: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  };

  return (
    <Badge className={`${colors[trend as keyof typeof colors]} flex items-center gap-1`}>
      {icons[trend as keyof typeof icons]}
      <span className="capitalize">{trend}</span>
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    normal: "bg-green-500/20 text-green-300 border-green-500/30",
    elevated: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    prediabetic: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  return (
    <Badge className={colors[status as keyof typeof colors]}>
      {status === "normal" ? "✓ Normal" : `⚠ ${status}`}
    </Badge>
  );
}

function getProgressValue(value: string, range: string): number {
  const val = parseFloat(value);
  const [min, max] = range.split(" - ").map(parseFloat);
  return ((val - min) / (max - min)) * 100;
}
