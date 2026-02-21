"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  LineChart,
  Shield,
  ArrowRight,
  Activity,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Lock,
  TrendingUp,
} from "lucide-react";
import { WorkxLogo } from "@/components/worx-logo";
import { ThemeToggle } from "@/components/theme-toggle";

// ─── Background ──────────────────────────────────────────────────────────────

function HeroBackground({ videoUrl }: { videoUrl: string | null }) {
  if (videoUrl) {
    return (
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.08] dark:opacity-20 transition-opacity"
        src={videoUrl}
      />
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-20 w-[700px] h-[700px] rounded-full bg-teal-400/10 dark:bg-teal-400/8 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 0.85, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full bg-cyan-400/8 dark:bg-cyan-400/6 blur-3xl"
      />
      {/* Light dot grid */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

// ─── DNA Illustration ─────────────────────────────────────────────────────────

function DNAIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 1 }}
      className="relative w-full max-w-xs mx-auto"
    >
      <svg viewBox="0 0 200 320" className="w-full" fill="none">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const y = 20 + i * 36;
          const x = 60 + Math.sin((i / 7) * Math.PI * 2) * 38;
          return (
            <motion.circle key={`L${i}`} cx={x} cy={y} r={5.5}
              fill="none" stroke="#14b8a6" strokeWidth={1.5}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ delay: i * 0.12, duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const y = 20 + i * 36;
          const x = 140 - Math.sin((i / 7) * Math.PI * 2) * 38;
          return (
            <motion.circle key={`R${i}`} cx={x} cy={y} r={5.5}
              fill="none" stroke="#0ea5e9" strokeWidth={1.5}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ delay: i * 0.12 + 0.25, duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const y = 20 + i * 36;
          const x1 = 60 + Math.sin((i / 7) * Math.PI * 2) * 38;
          const x2 = 140 - Math.sin((i / 7) * Math.PI * 2) * 38;
          return (
            <motion.line key={`rung${i}`} x1={x1} y1={y} x2={x2} y2={y}
              stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3 3"
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ delay: i * 0.1, duration: 2.5, repeat: Infinity }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Type 2 Diabetes Patient",
    avatar: "SK",
    rating: 5,
    text: "Finally I can read my lab results without googling every single value. Worx explained my HbA1c trend in plain English — my doctor was impressed I came in so informed.",
  },
  {
    name: "Marcus T.",
    role: "Marathon Runner",
    avatar: "MT",
    rating: 5,
    text: "I track my ferritin and vitamin D every 3 months. Worx catches the seasonal dips before I feel them. My performance has never been more consistent.",
  },
  {
    name: "Dr. Priya N.",
    role: "General Practitioner",
    avatar: "PN",
    rating: 5,
    text: "I recommend Worx to tech-savvy patients who want to engage with their own health data. It's medically accurate and doesn't sensationalize results.",
  },
  {
    name: "Elena R.",
    role: "New mum, 32",
    avatar: "ER",
    rating: 5,
    text: "Post-pregnancy bloodwork is overwhelming. Worx sorted through 20+ markers and told me exactly what to focus on. No panic, just clear actionable info.",
  },
];

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const prev = () => { setDir(-1); setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); };
  const next = () => { setDir(1); setIndex((i) => (i + 1) % TESTIMONIALS.length); };

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => { setDir(1); setIndex((i) => (i + 1) % TESTIMONIALS.length); }, 5000);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[index];

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 80, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -80, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            {/* Quote */}
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6">
              &ldquo;{t.text}&rdquo;
            </p>
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <button onClick={prev} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-teal-400 hover:text-teal-500 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? "bg-teal-500 w-4" : "bg-slate-300 dark:bg-slate-600"}`}
            />
          ))}
        </div>
        <button onClick={next} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-teal-400 hover:text-teal-500 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon, title, description, bullets }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 hover:border-teal-300 dark:hover:border-teal-800 hover:shadow-md dark:hover:shadow-none transition-all shadow-none">
      <div className="mb-4 w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/60 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{description}</p>
      <ul className="space-y-1.5">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
            {b}
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const taskIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    async function init() {
      try {
        // 1. Check if we already have a cached video URL (fast path)
        const cached = await fetch("/api/hero-video");
        const cachedData = await cached.json() as { videoUrl: string | null };
        if (cachedData.videoUrl) {
          if (!cancelled) setVideoUrl(cachedData.videoUrl);
          return; // Done — no need to regenerate
        }

        // 2. No cache — kick off a new generation
        const res = await fetch("/api/generate-hero-video", { method: "POST" });
        const data = await res.json() as { taskId?: string };
        if (cancelled || !data.taskId) return;
        taskIdRef.current = data.taskId;

        pollInterval = setInterval(async () => {
          if (cancelled) return;
          const poll = await fetch(`/api/generate-hero-video?taskId=${data.taskId}`);
          const result = await poll.json() as { status: string; videoUrl?: string };
          if (result.status === "complete" && result.videoUrl) {
            if (!cancelled) setVideoUrl(result.videoUrl);
            if (pollInterval) clearInterval(pollInterval);
          } else if (result.status === "failed") {
            if (pollInterval) clearInterval(pollInterval);
          }
        }, 8000);
      } catch {
        // Silently fail — hero works without video
      }
    }

    void init();
    return () => {
      cancelled = true;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between max-w-6xl">
          <WorkxLogo size={26} withWordmark />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white gap-1.5 shadow-sm">
                Try Demo
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950">
        <HeroBackground videoUrl={videoUrl} />
        <div className="relative z-10 container mx-auto px-6 pt-24 pb-20 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-6 tracking-widest uppercase">
                  <span className="w-5 h-px bg-teal-500" />
                  AI-Powered Blood Analysis
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-5xl md:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-5"
              >
                Your lab results,
                <br />
                <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  finally explained.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}
                className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-lg"
              >
                Stop googling every value. Worx turns complex bloodwork into clear,
                actionable insights — in seconds, powered by cutting-edge AI.
              </motion.p>

              {/* Social proof line */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="flex -space-x-2">
                  {["SK", "MT", "PN", "ER"].map((initials) => (
                    <div key={initials} className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[9px] font-bold text-white">
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">4.9/5</span> from early testers
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex gap-3 flex-wrap"
              >
                <Link href="/dashboard">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-7 gap-2 shadow-md shadow-teal-200 dark:shadow-none">
                    View Demo Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/how-it-was-made">
                  <Button size="lg" variant="outline" className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-2">
                    <Brain className="w-4 h-4" />
                    How It Works
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                className="mt-5 text-xs text-slate-400"
              >
                Demo only · All patient data is synthetic · Not medical advice
              </motion.p>
            </div>

            {/* Right — illustration + floating chips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              className="hidden md:flex flex-col items-center relative"
            >
              <DNAIllustration />
              {/* Floating metric cards */}
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                {[
                  { label: "Hemoglobin", value: "14.2 g/dL", status: "normal" },
                  { label: "Glucose", value: "105 mg/dL", status: "high" },
                  { label: "Cholesterol", value: "195 mg/dL", status: "normal" },
                  { label: "Vitamin D", value: "32 ng/mL", status: "normal" },
                ].map((chip, i) => (
                  <motion.div
                    key={chip.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm">
                      <p className="text-[10px] text-slate-400 mb-0.5">{chip.label}</p>
                      <p className={`text-sm font-semibold ${chip.status === "normal" ? "text-teal-600 dark:text-teal-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {chip.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-6 mt-20 pt-10 border-t border-slate-200 dark:border-slate-800"
          >
            {[
              { value: "20+", label: "Biomarkers analysed" },
              { value: "<2s", label: "Time to insight" },
              { value: "100%", label: "AI-generated codebase" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900/60">
              Everything you need
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              From raw numbers to real understanding
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Worx doesn&apos;t just display your results — it explains them, tracks them, and tells you what to do next.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Zap className="w-5 h-5 text-teal-500" />}
              title="Instant AI Analysis"
              description="Paste or upload your lab report. Get a full breakdown in under 2 seconds."
              bullets={[
                "Flags out-of-range values clearly",
                "Plain-English explanations for every marker",
                "Severity colour-coding (normal / warning / critical)",
              ]}
            />
            <FeatureCard
              icon={<TrendingUp className="w-5 h-5 text-teal-500" />}
              title="Trend Tracking"
              description="Upload results over time and watch your health story unfold."
              bullets={[
                "Historical comparison across dates",
                "Detects improving or worsening trends",
                "Correlates multiple markers automatically",
              ]}
            />
            <FeatureCard
              icon={<Lock className="w-5 h-5 text-teal-500" />}
              title="Private by Design"
              description="Your health data belongs to you — not advertisers or insurers."
              bullets={[
                "No account required for demo",
                "Data never sold or shared",
                "Processed in-memory, not stored",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white dark:bg-slate-950 py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">How it works</h2>
            <p className="text-slate-500 dark:text-slate-400">Three steps from confusion to clarity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: <Activity className="w-6 h-6 text-teal-500" />, title: "Upload your report", desc: "PDF, photo, or paste the values directly. We support all major lab formats." },
              { step: "02", icon: <Brain className="w-6 h-6 text-teal-500" />, title: "AI analyses everything", desc: "Our model cross-references your markers, flags anomalies, and builds a personalised picture." },
              { step: "03", icon: <LineChart className="w-6 h-6 text-teal-500" />, title: "Get clear insights", desc: "Read plain-English summaries, actionable recommendations, and trend charts." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-block mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/60 flex items-center justify-center mx-auto">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-teal-500 bg-white dark:bg-slate-950 border border-teal-200 dark:border-teal-900 rounded-full w-5 h-5 flex items-center justify-center">
                    {item.step.slice(1)}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50">
              What people say
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Real people. Real results.
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Join thousands taking control of their health data.</p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white dark:bg-slate-950 py-24">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to understand your health?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
              Try the demo dashboard now — no sign-up needed.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/dashboard">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 gap-2 shadow-lg shadow-teal-200/50 dark:shadow-none">
                  View Demo Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/how-it-was-made">
                <Button size="lg" variant="outline" className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Shield className="w-4 h-4 mr-2" />
                  Our Privacy Promise
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 py-10">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <WorkxLogo size={22} withWordmark />
          <p className="text-xs text-slate-400 text-center">
            Demo project · Claude Code 4.6 autonomous pipeline ·{" "}
            <a href="https://maxzilla.nl/blog/claude-autonomous-pipeline" className="text-teal-500 hover:text-teal-600 underline transition-colors">
              Read the write-up
            </a>
          </p>
          <p className="text-xs text-slate-400">All data is synthetic · Not medical advice</p>
        </div>
      </footer>
    </main>
  );
}
