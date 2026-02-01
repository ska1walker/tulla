import Link from 'next/link';
import { Sparkles, ArrowRight, Layers, Calendar as CalendarIcon, Heart } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 overflow-x-hidden font-sans selection:bg-rose-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-[#FAF9F6]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200/50 transition-transform hover:scale-105">
            <TulipLogo className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">maiflo</span>
        </div>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-stone-900 text-white text-sm font-bold rounded-full hover:bg-black transition-all shadow-lg active:scale-95"
        >
          Jetzt starten
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 rounded-full mb-8 text-rose-600 font-bold text-xs uppercase tracking-widest animate-pulse">
          <Sparkles className="w-4 h-4 text-rose-500" /> Planung neu gefühlt
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
          Marketing-Strategie <br />
          <span className="text-rose-500 italic font-light">in voller Blüte.</span>
        </h1>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          maiflo bringt Emotion und Klarheit in deine Kampagnenplanung – intuitiv, ästhetisch und
          mit dem Blick für das Wesentliche.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-10 py-5 bg-rose-500 text-white rounded-2xl font-bold shadow-2xl shadow-rose-200 hover:bg-rose-600 transition-all flex items-center gap-3 group active:scale-95"
          >
            Erleben beginnen{' '}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mockup Preview */}
        <div className="mt-24 relative px-4">
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent z-10" />
          <div className="bg-white rounded-[3rem] shadow-2xl border border-stone-100 p-4 transform rotate-1 hover:rotate-0 transition-transform duration-700 max-w-5xl mx-auto overflow-hidden">
            <div className="bg-stone-50 rounded-[2.5rem] border border-stone-100 flex flex-col p-0 overflow-hidden">
              <div className="h-14 border-b border-stone-200 flex items-center px-6 gap-6 bg-white">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-200" />
                  <div className="w-3 h-3 rounded-full bg-teal-200" />
                  <div className="w-3 h-3 rounded-full bg-stone-200" />
                </div>
                <div className="flex-grow flex justify-center gap-8">
                  {['Januar', 'Februar', 'März', 'April'].map((m) => (
                    <span
                      key={m}
                      className="text-[10px] font-black uppercase tracking-widest text-stone-300"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex divide-x divide-stone-200/50">
                <div className="w-48 p-4 space-y-6 bg-white/50 text-left">
                  {['Social Ads', 'Newsletter', 'OOH Media', 'Influencer'].map((ch) => (
                    <div
                      key={ch}
                      className="h-8 flex items-center font-bold text-stone-400 text-[11px] uppercase tracking-tight"
                    >
                      {ch}
                    </div>
                  ))}
                </div>
                <div className="flex-grow p-4 relative min-h-[300px] bg-white">
                  <div className="absolute inset-0 flex divide-x divide-stone-100">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex-grow" />
                    ))}
                  </div>
                  <div className="relative space-y-6 mt-1">
                    <div className="flex items-center text-left">
                      <div className="h-8 rounded-xl shadow-sm bg-[#A7F3D0] border-b-2 border-emerald-400/20 w-1/2 ml-4 animate-in slide-in-from-left duration-1000 flex items-center px-3 font-black text-[9px] text-emerald-800 uppercase tracking-widest">
                        Brand Image 2026
                      </div>
                    </div>
                    <div className="flex items-center text-left">
                      <div className="h-8 rounded-xl shadow-sm bg-[#FECACA] border-b-2 border-rose-400/20 w-1/3 ml-24 animate-in slide-in-from-left duration-700 flex items-center px-3 font-black text-[9px] text-rose-800 uppercase tracking-widest">
                        Spring Sale
                      </div>
                    </div>
                    <div className="flex items-center text-left">
                      <div className="h-8 rounded-xl shadow-sm bg-[#EDE9FE] border-b-2 border-violet-400/20 w-1/4 ml-40 animate-in slide-in-from-left duration-500 flex items-center px-3 font-black text-[9px] text-violet-800 uppercase tracking-widest">
                        New Launch
                      </div>
                    </div>
                    <div className="flex items-center text-left">
                      <div className="h-8 rounded-xl shadow-sm bg-[#99F6E4] border-b-2 border-teal-400/20 w-1/2 ml-10 animate-in slide-in-from-left duration-1000 flex items-center px-3 font-black text-[9px] text-teal-800 uppercase tracking-widest">
                        Awareness Boost
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white px-8 text-center">
        <h2 className="text-4xl font-black mb-16 tracking-tight">Für Visionärinnen gemacht.</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            {
              icon: <Layers className="text-teal-600 w-8 h-8" />,
              title: 'Gesamtjahr',
              desc: 'Der Panoramablick für deine strategischen Ziele und Meilensteine.',
            },
            {
              icon: <CalendarIcon className="text-rose-500 w-8 h-8" />,
              title: 'Monats-Fokus',
              desc: 'Deine operative Basis für die perfekte Steuerung.',
            },
            {
              icon: <Heart className="text-rose-400 w-8 h-8" />,
              title: 'Liebevolles Design',
              desc: 'Planung, die sich endlich nach Inspiration anfühlt.',
            },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-stone-800">{f.title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed max-w-[240px]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-stone-900 text-white text-center px-8">
        <div className="max-w-4xl mx-auto">
          <TulipLogo className="w-12 h-12 mx-auto mb-8 text-rose-500" />
          <p className="text-2xl font-light text-stone-400 leading-relaxed mb-12 italic">
            &ldquo;Wir glauben, dass großartiges Marketing Ruhe braucht. maiflo wurde entwickelt, um
            Platz für kreative Strategien zu schaffen.&rdquo;
          </p>
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.3em]">
            &copy; 2026 Kai Böhm Copyright
          </div>
        </div>
      </footer>
    </div>
  );
}
