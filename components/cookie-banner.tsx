/**
 * CookieBanner
 *
 * GDPR-style cookie consent banner. Persists choice in localStorage.
 * Shows on first visit; dismisses on Accept or Decline.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem('cookie-consent');
    if (!choice) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-xl dark:shadow-slate-900/50">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cookie className="w-4 h-4 text-teal-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Cookie preferences
                </span>
              </div>
              <button
                onClick={decline}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              We use cookies to improve your experience. This demo site uses only essential
              cookies — no tracking, no advertising. Your health data is never stored.
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={accept}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-xs shadow-none"
              >
                Accept all
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={decline}
                className="flex-1 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs shadow-none"
              >
                Essential only
              </Button>
            </div>

            <p className="mt-3 text-[10px] text-slate-400 text-center">
              By using this site you agree to our{' '}
              <span className="underline cursor-pointer hover:text-teal-500 transition-colors">
                Privacy Policy
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
