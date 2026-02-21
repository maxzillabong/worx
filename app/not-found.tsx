import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WorkxLogo } from "@/components/worx-logo";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors flex flex-col">
      {/* Top nav */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center max-w-7xl">
          <WorkxLogo size={20} withWordmark />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center mx-auto mb-6">
            <SearchX className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>

          <p className="text-sm font-mono text-teal-600 dark:text-teal-400 mb-3 tracking-widest uppercase">
            404
          </p>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Page not found
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                View dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
