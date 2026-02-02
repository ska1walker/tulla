'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Server, Trash2, Eye, EyeOff, Lock, Heart, CheckCircle, XCircle } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';

export default function DatenschutzVersprechenPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <TulipLogo className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg tracking-tight">
              <span className="font-black text-stone-900">mai</span>
              <span className="font-light text-rose-500 italic">flow</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-stone-50 py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full mb-6 text-emerald-700 text-xs font-bold uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            DSGVO-konform
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Datenschutz?
            <br />
            <span className="text-emerald-600">Haben wir ernst genommen.</span>
          </h1>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            Kein Marketing-Blabla. Hier erfährst du genau, was wir mit deinen Daten machen.
            Spoiler: Nicht viel.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Promise Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* No Tracking */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
              <EyeOff className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Wir tracken dich nicht</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Kein Google Analytics. Kein Facebook Pixel. Keine Werbe-IDs.
              Wir wissen nicht mal, wie lange du auf welcher Seite bist.
              Und das ist gut so.
            </p>
          </div>

          {/* EU Servers */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Deine Daten bleiben in der EU</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Firebase speichert in der EU (Belgien). Vercel hat Edge-Server in Frankfurt.
              Deine Kampagnenpläne fliegen nicht um die halbe Welt.
            </p>
          </div>

          {/* Delete Anytime */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Du kannst alles löschen</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Ein Klick im Menü, Bestätigung, fertig. Dein Konto und alle Daten sind weg.
              Keine E-Mail an den Support. Keine 30-Tage-Wartezeit. Sofort.
            </p>
          </div>

          {/* No Selling */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Wir verkaufen nichts</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Deine Daten werden nicht verkauft, nicht geteilt, nicht für Werbung genutzt.
              Wir verdienen Geld mit dem Produkt, nicht mit dir.
            </p>
          </div>
        </div>

        {/* What we store */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Eye className="w-6 h-6 text-stone-400" />
            Was wir speichern (Transparenz)
          </h2>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="divide-y divide-stone-100">
              {[
                { data: 'E-Mail-Adresse', why: 'Für Login & Passwort-Reset', where: 'Firebase Auth (EU)' },
                { data: 'Anzeigename', why: 'Damit dein Team dich erkennt', where: 'Firebase Firestore (EU)' },
                { data: 'Passwort', why: 'Für sichere Anmeldung', where: 'Firebase Auth (verschlüsselt)' },
                { data: 'Projekte & Kampagnen', why: 'Deine Arbeit', where: 'Firebase Firestore (EU)' },
                { data: 'Team-Einladungen', why: 'Damit Kollegen beitreten können', where: 'Firebase Firestore (EU)' },
              ].map((item, i) => (
                <div key={i} className="grid md:grid-cols-3 gap-4 p-4 hover:bg-stone-50 transition-colors">
                  <div className="font-medium text-stone-900">{item.data}</div>
                  <div className="text-sm text-stone-500">{item.why}</div>
                  <div className="text-sm text-stone-400">{item.where}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we DON'T store */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400" />
            Was wir NICHT speichern
          </h2>

          <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'IP-Adressen (nur temporär bei Vercel)',
                'Browser-Fingerprints',
                'Standortdaten',
                'Geräte-IDs',
                'Surfverhalten',
                'Klick-Tracking',
                'Scroll-Tracking',
                'Heatmaps',
                'Session Recordings',
                'Werbe-IDs',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Security */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-stone-400" />
            Technische Sicherheit
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'HTTPS/TLS', desc: 'Verschlüsselte Übertragung' },
              { label: 'Firebase Security Rules', desc: 'Zugriffskontrolle auf Datenbankebene' },
              { label: 'Passwort-Hashing', desc: 'Bcrypt via Firebase Auth' },
              { label: 'Keine Cookies für Tracking', desc: 'Nur technisch notwendige' },
              { label: 'Regelmäßige Updates', desc: 'Aktuelle Sicherheitspatches' },
              { label: 'Open Source Dependencies', desc: 'Überprüfbare Bibliotheken' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-stone-200">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-stone-900">{item.label}</div>
                  <div className="text-sm text-stone-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Deine Rechte (DSGVO)</h2>

          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { right: 'Auskunft', action: 'Frag uns, was wir über dich wissen' },
                { right: 'Berichtigung', action: 'Änder deine Daten im Profil' },
                { right: 'Löschung', action: 'Ein Klick → alles weg' },
                { right: 'Widerspruch', action: 'Schreib uns, wir hören zu' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-emerald-900">{item.right}</div>
                    <div className="text-sm text-emerald-700">{item.action}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-emerald-200">
              <p className="text-sm text-emerald-700">
                Fragen? Schreib uns an{' '}
                <a href="mailto:support@maiflow.app" className="font-medium underline">
                  support@maiflow.app
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-b from-stone-100 to-stone-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Überzeugt?
          </h2>
          <p className="text-stone-500 mb-6">
            Probier maiflow aus. Kostenlos. Ohne deine Seele zu verkaufen.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-black transition-all hover:scale-105"
          >
            Jetzt starten
          </Link>
        </section>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-stone-200 flex gap-6 text-sm">
          <Link
            href="/datenschutz"
            className="text-stone-500 hover:text-rose-500 transition-colors"
          >
            Rechtliche Datenschutzerklärung
          </Link>
          <Link
            href="/impressum"
            className="text-stone-500 hover:text-rose-500 transition-colors"
          >
            Impressum
          </Link>
        </div>
      </main>
    </div>
  );
}
