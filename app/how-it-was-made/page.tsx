"use client";

import type React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Brain, Code, Zap, CheckCircle, ArrowLeft } from "lucide-react";
import { WorkxLogo } from "@/components/worx-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HowItWasMade(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Top nav */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-5xl">
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
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Badge className="bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/20 mb-4">
            Behind the Build
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            How Worx Was Made
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            100% autonomously built by Claude Code 4.6 &middot; Zero human code
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* The Experiment */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white">The Experiment</CardTitle>
                </div>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Testing Claude Code&apos;s autonomous development pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600 dark:text-slate-300 space-y-4">
                <p>On February 21, 2026, I gave Claude Code a single prompt:</p>
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 font-mono text-sm text-teal-600 dark:text-teal-400">
                  &quot;Build a virtual bloodwork lab website with a landing page and dashboard.
                  Make it colorful, use Shadcn UI, and deploy it to worx.maxzilla.nl&quot;
                </div>
                <p>Then I walked away. This is what Claude built.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* The Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center">
                    <Code className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white">The Pipeline</CardTitle>
                </div>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Claude Code&apos;s new autonomous features in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Step number={1} title="Programmatic Tool Calling" description="Claude wrote code that called multiple tools autonomously" />
                  <Step number={2} title="Live Preview" description="Monitored the running app and iterated on design" />
                  <Step number={3} title="Code Review" description="Reviewed its own code, left inline comments, applied fixes" />
                  <Step number={4} title="Security Scan" description="Scanned for vulnerabilities (found none!)" />
                  <Step number={5} title="Auto-Deploy" description="Deployed to production without human intervention" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* The Results */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white">The Results</CardTitle>
                </div>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  What actually worked vs. what needed help
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Result
                  icon={<CheckCircle className="w-4 h-4 text-teal-500" />}
                  title="What Worked"
                  accent="teal"
                  items={[
                    "Landing page design and animations",
                    "Dashboard layout and components",
                    "TypeScript configuration",
                    "Styling with Tailwind + Shadcn",
                  ]}
                />
                <Separator className="bg-slate-100 dark:bg-slate-800" />
                <Result
                  icon={<CheckCircle className="w-4 h-4 text-cyan-500" />}
                  title="What's Next (Claude's Job)"
                  accent="cyan"
                  items={[
                    "AI Blood Analysis feature",
                    "Real-time insights generation",
                    "Database integration",
                    "Automated testing",
                  ]}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Blog link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-center pt-4 pb-8 text-slate-500 dark:text-slate-400"
          >
            <p className="mb-2 text-sm">Read the full technical breakdown on my blog:</p>
            <a
              href="https://maxzilla.nl/blog/claude-autonomous-pipeline"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 underline underline-offset-4 font-medium"
            >
              maxzilla.nl/blog/claude-autonomous-pipeline
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }): React.JSX.Element {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xs">
        {number}
      </div>
      <div>
        <h2 className="text-slate-800 dark:text-slate-200 font-semibold text-sm mb-0.5">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

function Result({ icon, title, accent, items }: { icon: React.ReactNode; title: string; accent: "teal" | "cyan"; items: string[] }): React.JSX.Element {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{title}</h2>
      </div>
      <ul className="space-y-1.5 ml-6">
        {items.map((item) => (
          <li key={item} className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
            <span className={`w-1 h-1 rounded-full flex-shrink-0 ${accent === "teal" ? "bg-teal-400" : "bg-cyan-400"}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
