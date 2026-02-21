"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Brain,
  LineChart,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* AI Generated Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-8"
          >
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-6 py-2 text-sm font-medium">
              🤖 100% AI Generated • Zero Human Code
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
          >
            Worx
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-3xl text-purple-200 mb-4 font-light"
          >
            AI-Powered Blood Analysis
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto"
          >
            Built entirely by Claude Code 4.6. This entire website—design, code,
            deployment—was created autonomously by AI. No human wrote a single
            line of code.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                View Demo Dashboard
                <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/how-it-was-made">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                How It Was Made
                <Brain className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto"
        >
          <FeatureCard
            icon={<Activity className="w-6 h-6 text-pink-400" />}
            title="Real-Time Analysis"
            description="Instant bloodwork insights powered by advanced AI models"
          />
          <FeatureCard
            icon={<LineChart className="w-6 h-6 text-purple-400" />}
            title="Trend Tracking"
            description="Monitor your health metrics over time with beautiful visualizations"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-blue-400" />}
            title="Secure & Private"
            description="Your health data stays private with end-to-end encryption"
          />
        </motion.div>

        {/* Tech Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-24 text-center text-slate-500 text-sm"
        >
          <p className="mb-2">
            This is a demonstration project testing Claude Code&apos;s autonomous
            development capabilities.
          </p>
          <p>All data is fake. Built Feb 21, 2026.</p>
          <p className="mt-4">
            Read the full breakdown:{" "}
            <a
              href="https://maxzilla.nl/blog/claude-autonomous-pipeline"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              maxzilla.nl/blog
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-slate-900/50 border-purple-500/20 p-6 hover:border-purple-500/40 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-purple-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </Card>
  );
}
