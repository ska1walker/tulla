'use client';

import { useState } from 'react';
import { Share2, X, Check, Copy, MessageCircle } from 'lucide-react';

interface ShareButtonProps {
  variant?: 'default' | 'compact' | 'text';
  className?: string;
}

const SHARE_URL = 'https://maiflow.app';
const SHARE_TITLE = 'maiflow - Kampagnenplanung für Marketing-Teams';
const SHARE_TEXT = 'Schau dir maiflow an – der visuelle Kampagnenplaner für Teams. DSGVO-konform und kostenlos bis 50 Nutzer!';

export function ShareButton({ variant = 'default', className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
        setIsOpen(false);
      } catch (err) {
        // User cancelled or error - ignore
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = SHARE_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`,
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
    },
    {
      name: 'X',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'bg-black hover:bg-stone-800',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
    },
  ];

  const canNativeShare = typeof navigator !== 'undefined' && navigator.share;

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg text-stone-500 hover:text-rose-500 hover:bg-rose-50 transition-colors ${className}`}
          title="Teilen"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-stone-200 shadow-xl z-50 overflow-hidden">
              <div className="p-2">
                {canNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Teilen...</span>
                  </button>
                )}
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <span className="text-stone-500">{link.icon}</span>
                    <span className="text-sm font-medium">{link.name}</span>
                  </a>
                ))}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-stone-500" />
                  )}
                  <span className="text-sm font-medium">{copied ? 'Kopiert!' : 'Link kopieren'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 text-stone-500 hover:text-rose-500 transition-colors ${className}`}
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Teilen</span>
      </button>
    );
  }

  // Default variant - full card
  return (
    <>
      <div className={`bg-white rounded-2xl border border-stone-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="font-bold text-stone-900 mb-2">Gefällt dir maiflow?</h3>
          <p className="text-sm text-stone-500 mb-4">Erzähl deinen Freunden und Kollegen davon!</p>

          <div className="flex justify-center gap-2">
            {canNativeShare && (
              <button
                onClick={handleNativeShare}
                className="p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors"
                title="Teilen"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 text-white rounded-xl transition-colors ${link.color}`}
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
            <button
              onClick={handleCopyLink}
              className="p-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl transition-colors"
              title="Link kopieren"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {copied && (
            <p className="text-sm text-emerald-600 mt-3 font-medium">Link kopiert!</p>
          )}
        </div>
      </div>
    </>
  );
}
