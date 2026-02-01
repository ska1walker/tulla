'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, BarChart3, Users, Download, Calendar, Palette } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';

export function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 overflow-x-hidden font-sans selection:bg-rose-100">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200/50">
            <TulipLogo className="w-5 h-5" />
          </div>
          <span className="text-xl tracking-tight">
            <span className="font-black">mai</span>
            <span className="font-light text-rose-500 italic">flow</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:block px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Anmelden
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 bg-stone-900 text-white text-sm font-bold rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Loslegen
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-full mb-8 text-rose-600 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Kampagnenplanung neu gedacht
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            Dein Marketing-Jahr.
            <br />
            <span className="text-rose-500">Wunderschön geplant.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Der visuelle Kampagnenplaner für Teams, die wissen:
            Gutes Marketing verdient ein gutes Tool. Einfach. Ästhetisch. Durchdacht.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-rose-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-rose-200 hover:bg-rose-600 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
            >
              Kostenlos starten
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-sm text-stone-400">Keine Kreditkarte nötig</span>
          </div>
        </div>

        {/* Product Preview */}
        <div className="mt-16 md:mt-24 relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-100/50 via-transparent to-transparent blur-3xl -z-10" />

          {/* Browser Frame */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform hover:scale-[1.01] transition-transform duration-700">
            {/* Browser Bar */}
            <div className="h-10 md:h-12 border-b border-stone-100 flex items-center px-4 gap-2 bg-stone-50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 bg-white rounded-lg text-[10px] text-stone-400 border border-stone-100">
                  maiflow.app
                </div>
              </div>
            </div>

            {/* App Preview */}
            <div className="p-4 md:p-6 bg-stone-50">
              {/* Timeline Header */}
              <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                <div className="h-10 border-b border-stone-100 flex items-center px-4 gap-8 text-[10px] font-bold uppercase tracking-widest text-stone-300">
                  <span className="w-24">Kanal</span>
                  {['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'].map((m) => (
                    <span key={m} className="flex-1 text-center">{m}</span>
                  ))}
                </div>

                {/* Timeline Rows */}
                <div className="divide-y divide-stone-50">
                  {[
                    { channel: 'Social Media', campaigns: [{ start: 5, width: 35, color: '#A7F3D0', name: 'Markenaufbau' }] },
                    { channel: 'Newsletter', campaigns: [{ start: 20, width: 25, color: '#FECACA', name: 'Frühlingsaktion' }, { start: 55, width: 20, color: '#FED7AA', name: 'Update' }] },
                    { channel: 'Display Ads', campaigns: [{ start: 35, width: 40, color: '#DDD6FE', name: 'Produktlaunch' }] },
                    { channel: 'Influencer', campaigns: [{ start: 10, width: 20, color: '#99F6E4', name: 'Kooperation Q1' }] },
                  ].map((row, i) => (
                    <div key={i} className="flex h-12 items-center px-4 hover:bg-stone-50/50 transition-colors">
                      <span className="w-24 text-xs font-semibold text-stone-600 truncate">{row.channel}</span>
                      <div className="flex-1 relative h-7">
                        {row.campaigns.map((c, j) => (
                          <div
                            key={j}
                            className="absolute top-0 h-full rounded-lg shadow-sm flex items-center px-2 text-[9px] font-bold uppercase tracking-wide overflow-hidden animate-in slide-in-from-left duration-700"
                            style={{
                              left: `${c.start}%`,
                              width: `${c.width}%`,
                              backgroundColor: c.color,
                              animationDelay: `${(i * 0.1) + (j * 0.1)}s`,
                              color: c.color === '#A7F3D0' ? '#065f46' : c.color === '#FECACA' ? '#991b1b' : c.color === '#DDD6FE' ? '#5b21b6' : c.color === '#99F6E4' ? '#115e59' : '#9a3412'
                            }}
                          >
                            <span className="truncate">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 md:py-16 border-y border-stone-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-stone-400 mb-8">
            Für Marketing-Teams, denen Design nicht egal ist
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            {['Studio', 'Agentur', 'Brand', 'Kreativ', 'Digital'].map((name) => (
              <div key={name} className="text-lg md:text-xl font-black text-stone-300 tracking-tight">
                {name}
                <span className="text-rose-300">.</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Excel war gestern.
            </h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Deine Kampagnen verdienen mehr als endlose Tabellenblätter und unübersichtliche Gantt-Charts.
              maiflow bringt Klarheit – und sieht dabei auch noch gut aus.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Calendar className="w-6 h-6" />,
                title: 'Das große Ganze sehen',
                desc: 'Dein gesamtes Jahr auf einer Timeline. Zoom von Quartalen bis Wochen – mit einem Klick.',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Budgets im Blick',
                desc: 'Plan vs. Ist-Ausgaben, sofort sichtbar. Du weißt immer, wo du stehst.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Gemeinsam planen',
                desc: 'Lade dein Team ein, vergib Rollen, arbeitet zusammen. Alle sind auf dem gleichen Stand.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 md:p-8 bg-white rounded-2xl border border-stone-100 hover:border-rose-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-5 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Alles, was du brauchst.
              <br />
              <span className="text-rose-400">Nichts, was du nicht brauchst.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <Palette />, text: 'Eigene Kampagnentypen & Farben' },
              { icon: <Calendar />, text: '3 strategische Phasen pro Jahr' },
              { icon: <BarChart3 />, text: 'Budget-Tracking mit Trends' },
              { icon: <Users />, text: 'Team-Rollen & Berechtigungen' },
              { icon: <Download />, text: 'Export als PNG für Präsentationen' },
              { icon: <Sparkles />, text: 'Schönes, minimales Design' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center text-rose-400">
                  {item.icon}
                </div>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-8">💐</div>
          <blockquote className="text-2xl md:text-3xl font-light text-stone-700 leading-relaxed mb-8 italic">
            &ldquo;Endlich ein Planungstool, bei dem ich nicht sofort den Laptop zuklappen will.
            maiflow ist genau das, was unser Team gebraucht hat.&rdquo;
          </blockquote>
          <div>
            <div className="font-bold text-stone-900">Marketing-Leitung</div>
            <div className="text-sm text-stone-400">Kreativagentur</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Bereit für bessere Planung?
          </h2>
          <p className="text-lg text-stone-500 mb-10">
            Schließ dich Teams an, die schon auf schöne Kampagnenplanung umgestiegen sind.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-10 py-5 bg-rose-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-rose-200 hover:bg-rose-600 hover:shadow-2xl hover:scale-105 transition-all group"
          >
            Jetzt kostenlos starten
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-stone-400">
            {['Kostenlos starten', 'Keine Kreditkarte', 'In 2 Minuten startklar'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-stone-900 text-white px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <TulipLogo className="w-8 h-8 text-rose-500" />
              <span className="text-xl tracking-tight">
                <span className="font-black">mai</span>
                <span className="font-light text-rose-500 italic">flow</span>
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-stone-400">
              <Link href="/login" className="hover:text-white transition-colors">Anmelden</Link>
              <Link href="/credits" className="hover:text-white transition-colors flex items-center gap-1">
                <span>Credits</span>
                <span className="text-base">🎮</span>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
            <div>&copy; 2026 maiflow. Mit Liebe gemacht in Deutschland.</div>
            <Link
              href="/credits"
              className="px-3 py-1.5 bg-stone-800 hover:bg-rose-500 rounded-lg transition-all duration-300 flex items-center gap-2 group"
            >
              <span className="font-mono text-[10px] tracking-wider text-stone-400 group-hover:text-white">INSERT COIN</span>
              <span>🎮</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
