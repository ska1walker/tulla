'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'maiflow-cookie-consent';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged the banner
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      // Small delay for better UX - don't show immediately on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Trigger animation after mount
        requestAnimationFrame(() => setIsAnimating(true));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsAnimating(false);
    // Wait for animation to complete before hiding
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleDismiss = () => {
    // Just dismiss for this session without saving preference
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 transition-all duration-300 ease-out ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
          {/* Header accent line */}
          <div className="h-1 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400" />

          <div className="p-5 md:p-6">
            <div className="flex items-start gap-4">
              {/* Cookie Icon */}
              <div className="hidden sm:flex w-12 h-12 bg-rose-50 rounded-xl items-center justify-center flex-shrink-0">
                <span className="text-2xl">🍪</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
                  <span className="sm:hidden text-xl">🍪</span>
                  Wir mögen Cookies – aber nur zum Essen.
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  maiflow nutzt nur technisch notwendige Speicherung für deine Anmeldung.
                  Kein Tracking. Kein Schnickschnack. Versprochen.
                </p>
              </div>

              {/* Close button (mobile) */}
              <button
                onClick={handleDismiss}
                className="sm:hidden p-1 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <Link
                href="/datenschutz"
                className="text-sm text-stone-500 hover:text-rose-500 transition-colors text-center sm:text-left order-2 sm:order-1"
              >
                Mehr erfahren →
              </Link>

              <div className="flex-1 hidden sm:block" />

              <button
                onClick={handleAccept}
                className="order-1 sm:order-2 px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Alles klar
                <span className="text-base">✓</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
