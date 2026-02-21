"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Code, Zap, CheckCircle } from "lucide-react";

export default function HowItWasMade() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-8 hover:bg-purple-500/30 cursor-pointer">
            ← Back to Home
          </Badge>
        </Link>

        <h1 className="text-5xl font-bold text-purple-200 mb-4">
          How Worx Was Made
        </h1>
        <p className="text-xl text-slate-400 mb-12">
          100% autonomously built by Claude Code 4.6 • Zero human code
        </p>

        <div className="space-y-8">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-6 h-6 text-purple-400" />
                <CardTitle className="text-purple-200">The Experiment</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Testing Claude Code&apos;s autonomous development pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                On February 21, 2026, I gave Claude Code a single prompt:
              </p>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-purple-300">
                &quot;Build a virtual bloodwork lab website with a landing page and dashboard.
                Make it colorful, use Shadcn UI, and deploy it to worx.maxzilla.nl&quot;
              </div>
              <p>
                Then I walked away. This is what Claude built.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Code className="w-6 h-6 text-purple-400" />
                <CardTitle className="text-purple-200">The Pipeline</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Claude Code&apos;s new autonomous features in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Step
                  number={1}
                  title="Programmatic Tool Calling"
                  description="Claude wrote code that called multiple tools autonomously"
                />
                <Step
                  number={2}
                  title="Live Preview"
                  description="Monitored the running app and iterated on design"
                />
                <Step
                  number={3}
                  title="Code Review"
                  description="Reviewed its own code, left inline comments, applied fixes"
                />
                <Step
                  number={4}
                  title="Security Scan"
                  description="Scanned for vulnerabilities (found none!)"
                />
                <Step
                  number={5}
                  title="Auto-Deploy"
                  description="Deployed to production without human intervention"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-purple-400" />
                <CardTitle className="text-purple-200">The Results</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                What actually worked vs. what needed help
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Result
                icon={<CheckCircle className="w-5 h-5 text-green-400" />}
                title="What Worked"
                items={[
                  "Landing page design and animations",
                  "Dashboard layout and components",
                  "TypeScript configuration",
                  "Styling with Tailwind + Shadcn",
                ]}
              />
              <Result
                icon={<CheckCircle className="w-5 h-5 text-yellow-400" />}
                title="What's Next (Claude's Job)"
                items={[
                  "AI Blood Analysis feature",
                  "Real-time insights generation",
                  "Database integration",
                  "Automated testing",
                ]}
              />
            </CardContent>
          </Card>

          <div className="text-center text-slate-400 pt-8 border-t border-slate-800">
            <p className="mb-2">
              Read the full technical breakdown on my blog:
            </p>
            <a
              href="https://maxzilla.nl/blog/claude-autonomous-pipeline"
              className="text-purple-400 hover:text-purple-300 underline text-lg font-medium"
            >
              maxzilla.nl/blog/claude-autonomous-pipeline
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
        {number}
      </div>
      <div>
        <h4 className="text-purple-200 font-semibold mb-1">{title}</h4>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

function Result({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="text-purple-200 font-semibold">{title}</h4>
      </div>
      <ul className="space-y-2 ml-7">
        {items.map((item, i) => (
          <li key={i} className="text-slate-400 text-sm">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
