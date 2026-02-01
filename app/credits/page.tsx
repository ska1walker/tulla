'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CreditsPage() {
  const [scrollY, setScrollY] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollY((prev) => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const techStack = [
    { name: 'Next.js 16', role: 'The Framework' },
    { name: 'React 19', role: 'UI Library' },
    { name: 'TypeScript', role: 'Type Safety' },
    { name: 'Tailwind CSS', role: 'Styling Engine' },
    { name: 'Firebase', role: 'Backend & Auth' },
    { name: 'Firestore', role: 'Database' },
    { name: 'Recharts', role: 'Data Visualization' },
    { name: 'Lucide Icons', role: 'Icon System' },
    { name: 'date-fns', role: 'Date Handling' },
    { name: 'html-to-image', role: 'Export Magic' },
    { name: 'Vercel', role: 'Deployment' },
  ];

  return (
    <div className="min-h-screen bg-stone-950 overflow-hidden relative">
      {/* Scanlines effect */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* CRT glow effect */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-gradient-radial from-transparent via-transparent to-stone-950/50" />

      {/* Floating pixels decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-rose-500/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen py-20 px-8">

        {/* Title */}
        <div className="mb-16 text-center">
          <h1
            className="text-6xl md:text-8xl font-black tracking-tight mb-4"
            style={{
              fontFamily: 'monospace',
              textShadow: '4px 4px 0 #be123c, 8px 8px 0 #881337',
            }}
          >
            <span className="text-rose-400">MAI</span>
            <span className="text-rose-300 italic">FLOW</span>
          </h1>
          <div className="text-rose-500/80 text-sm tracking-[0.5em] font-mono uppercase">
            Campaign Planning System
          </div>
        </div>

        {/* Credits scroll container */}
        <div
          className="w-full max-w-2xl space-y-16 text-center font-mono"
          style={{
            transform: `translateY(${-scrollY * 0.5}px)`,
          }}
        >

          {/* Dedication */}
          <section className="space-y-4">
            <h2 className="text-rose-500 text-xs tracking-[0.3em] uppercase">Dedicated To</h2>
            <div className="text-3xl text-rose-300 font-bold tracking-wide">
              MAIKE
            </div>
            <div className="text-rose-400/60 text-sm max-w-md mx-auto leading-relaxed">
              Who loves flowers and inspired the name
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {['🌷', '🌸', '🌺', '🌻', '🌼'].map((flower, i) => (
                <span
                  key={i}
                  className="text-2xl"
                  style={{
                    animation: 'bounce 1s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {flower}
                </span>
              ))}
            </div>
          </section>

          {/* The meaning */}
          <section className="space-y-4 py-8 border-y border-rose-900/30">
            <h2 className="text-rose-500 text-xs tracking-[0.3em] uppercase">The Name</h2>
            <div className="text-rose-300/80 text-lg leading-relaxed max-w-lg mx-auto">
              <span className="text-rose-400 font-bold">MAI</span> stands for{' '}
              <span className="text-rose-400 font-bold">M</span>y{' '}
              <span className="text-rose-400 font-bold">A</span>I-powered{' '}
              <span className="text-rose-400 font-bold">I</span>nterface
              <br />
              <span className="text-rose-500/60 text-sm">
                ...but really, it&apos;s just for Maike
              </span>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="space-y-6">
            <h2 className="text-rose-500 text-xs tracking-[0.3em] uppercase">Powered By</h2>
            <div className="grid grid-cols-2 gap-4">
              {techStack.map((tech, i) => (
                <div
                  key={tech.name}
                  className="p-3 border border-rose-900/30 bg-rose-950/20"
                  style={{
                    animation: 'fadeIn 0.5s ease-out forwards',
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <div className="text-rose-300 font-bold text-sm">{tech.name}</div>
                  <div className="text-rose-500/50 text-xs">{tech.role}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Developer */}
          <section className="space-y-4">
            <h2 className="text-rose-500 text-xs tracking-[0.3em] uppercase">Developed By</h2>
            <div className="text-2xl text-rose-300 font-bold">
              KAI
            </div>
            <div className="text-rose-500/50 text-xs">
              with love and lots of coffee
            </div>
          </section>

          {/* AI Assistant */}
          <section className="space-y-4">
            <h2 className="text-rose-500 text-xs tracking-[0.3em] uppercase">AI Assistant</h2>
            <div className="text-2xl text-rose-300 font-bold">
              CLAUDE
            </div>
            <div className="text-rose-500/50 text-xs">
              Anthropic&apos;s AI • Opus 4.5
            </div>
          </section>

          {/* Quote */}
          <section
            className="py-12 space-y-6 cursor-pointer"
            onClick={() => setShowEasterEgg(!showEasterEgg)}
          >
            <div className="text-4xl">💐</div>
            <blockquote className="text-rose-300/90 text-lg italic max-w-md mx-auto leading-relaxed">
              &ldquo;Like flowers need sunlight to bloom,
              <br />
              great campaigns need the right timing to flourish.
              <br />
              <span className="text-rose-400">This one&apos;s for you, Maike.</span>&rdquo;
            </blockquote>
            {showEasterEgg && (
              <div className="text-rose-500/60 text-sm animate-pulse">
                ♥ You found the secret! ♥
              </div>
            )}
          </section>

          {/* Year */}
          <section className="space-y-4 pb-32">
            <div className="text-rose-500/30 text-xs tracking-[0.3em]">
              © 2025 MAIFLOW
            </div>
            <div className="text-rose-500/20 text-xs">
              MADE WITH ♥ IN GERMANY
            </div>
          </section>

          {/* Game over style ending */}
          <section className="py-20">
            <div
              className="text-rose-400 text-2xl font-bold tracking-widest animate-pulse"
              style={{ textShadow: '0 0 20px rgba(244, 63, 94, 0.5)' }}
            >
              THANK YOU FOR PLAYING
            </div>
            <div className="text-rose-500/40 text-xs mt-4 tracking-wider">
              PRESS START TO CONTINUE
            </div>
          </section>

        </div>

        {/* Back button */}
        <Link
          href="/projects"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-rose-500/20 border border-rose-500/50 text-rose-400 font-mono text-sm hover:bg-rose-500/30 transition-colors z-50"
        >
          ← BACK TO GAME
        </Link>

      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
