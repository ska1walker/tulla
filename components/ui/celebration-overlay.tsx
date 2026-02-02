'use client';

import { useState, useEffect, useCallback } from 'react';

// Pixel art style emojis/elements that fly across
const FLYING_ELEMENTS = [
  '🌷', // Tulip (brand!)
  '🦄', // Unicorn (Asana classic)
  '🚀', // Rocket
  '💐', // Bouquet
  '🎈', // Balloon
  '🦋', // Butterfly
  '💖', // Heart
  '⭐', // Star
  '🎉', // Party
  '✨', // Sparkles
  '🌸', // Cherry blossom
  '🎯', // Target
];

// Motivational messages in German
const MESSAGES = [
  { text: 'Boom! Kampagne erstellt!', emoji: '🎉' },
  { text: 'Du rockst das Marketing!', emoji: '🚀' },
  { text: 'Läuft bei dir!', emoji: '⭐' },
  { text: 'Marketing-Magie aktiviert!', emoji: '✨' },
  { text: 'Weiter so, Champion!', emoji: '🏆' },
  { text: 'Kreativität freigesetzt!', emoji: '🎨' },
  { text: 'Ein Schritt näher zum Ziel!', emoji: '🎯' },
  { text: 'Dein Plan nimmt Form an!', emoji: '🌷' },
  { text: 'Perfekt geplant!', emoji: '💪' },
  { text: 'Das wird großartig!', emoji: '🌟' },
];

interface FlyingElement {
  id: number;
  emoji: string;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
}

interface ConfettiParticle {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

interface CelebrationOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function CelebrationOverlay({ isVisible, onComplete }: CelebrationOverlayProps) {
  const [elements, setElements] = useState<FlyingElement[]>([]);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [show, setShow] = useState(false);

  const generateElements = useCallback(() => {
    // Generate 15-20 flying elements
    const count = 15 + Math.floor(Math.random() * 6);
    const newElements: FlyingElement[] = [];

    for (let i = 0; i < count; i++) {
      newElements.push({
        id: i,
        emoji: FLYING_ELEMENTS[Math.floor(Math.random() * FLYING_ELEMENTS.length)],
        startX: Math.random() * 100,
        startY: 100 + Math.random() * 20, // Start below viewport
        size: 24 + Math.random() * 24, // 24-48px
        duration: 2 + Math.random() * 2, // 2-4 seconds
        delay: Math.random() * 1, // 0-1 second delay
      });
    }

    setElements(newElements);

    // Generate confetti
    const confettiCount = 50;
    const newConfetti: ConfettiParticle[] = [];
    const colors = ['#F43F5E', '#FB7185', '#FECDD3', '#FDE047', '#A7F3D0', '#DDD6FE', '#93C5FD'];

    for (let i = 0; i < confettiCount; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 6,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 0.5,
      });
    }

    setConfetti(newConfetti);

    // Random message
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
  }, []);

  useEffect(() => {
    if (isVisible) {
      generateElements();
      setShow(true);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 500); // Wait for fade out
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, generateElements, onComplete]);

  if (!isVisible && !show) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] pointer-events-none transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={`confetti-${particle.id}`}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Flying elements */}
      {elements.map((element) => (
        <div
          key={`element-${element.id}`}
          className="absolute animate-fly-diagonal"
          style={{
            left: `${element.startX}%`,
            bottom: '0%',
            fontSize: `${element.size}px`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        >
          {element.emoji}
        </div>
      ))}

      {/* Message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`bg-white/95 backdrop-blur-xl px-8 py-6 rounded-3xl shadow-2xl border border-rose-100 transform transition-all duration-500 ${
            show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className="text-center">
            <div className="text-5xl mb-3 animate-bounce">{message.emoji}</div>
            <p className="text-2xl font-black text-stone-900 tracking-tight">
              {message.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Create a global celebration trigger
let celebrationCallback: (() => void) | null = null;

export function setCelebrationCallback(callback: () => void) {
  celebrationCallback = callback;
}

export function triggerCelebration() {
  if (celebrationCallback) {
    celebrationCallback();
  }
}
