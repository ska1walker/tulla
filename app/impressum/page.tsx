'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';

export default function ImpressumPage() {
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

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Impressum</h1>

        <div className="prose prose-stone max-w-none space-y-8">
          {/* Angaben gemäß § 5 TMG */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="text-stone-700">
              Kai Böhm<br />
              Am Sportplatz 14<br />
              29633 Munster<br />
              Deutschland
            </p>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Kontakt</h2>
            <p className="text-stone-700">
              E-Mail:{' '}
              <a
                href="mailto:support@maiflow.app"
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                support@maiflow.app
              </a>
            </p>
          </section>

          {/* Verantwortlich für den Inhalt */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p className="text-stone-700">
              Kai Böhm<br />
              Am Sportplatz 14<br />
              29633 Munster
            </p>
          </section>

          {/* EU-Streitschlichtung */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              EU-Streitschlichtung
            </h2>
            <p className="text-stone-700">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="text-stone-700 mt-2">
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          {/* Verbraucherstreitbeilegung */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Verbraucherstreitbeilegung/Universalschlichtungsstelle
            </h2>
            <p className="text-stone-700">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          {/* Haftung für Inhalte */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Haftung für Inhalte
            </h2>
            <p className="text-stone-700">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
              auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
              §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
              verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
              überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>
            <p className="text-stone-700 mt-2">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
              Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
              Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
              von entsprechenden Rechtsverletzungen werden wir diese Inhalte
              umgehend entfernen.
            </p>
          </section>

          {/* Haftung für Links */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Haftung für Links
            </h2>
            <p className="text-stone-700">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren
              Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
              fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
              Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
              Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
              Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
            <p className="text-stone-700 mt-2">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch
              ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
              Bekanntwerden von Rechtsverletzungen werden wir derartige Links
              umgehend entfernen.
            </p>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Urheberrecht
            </h2>
            <p className="text-stone-700">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
              Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
              Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
              jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
              sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className="text-stone-700 mt-2">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
              wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden
              Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf
              eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
              entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
              werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-stone-200 flex gap-6 text-sm">
          <Link
            href="/datenschutz"
            className="text-stone-500 hover:text-rose-500 transition-colors"
          >
            Datenschutz
          </Link>
          <Link
            href="/"
            className="text-stone-500 hover:text-rose-500 transition-colors"
          >
            Startseite
          </Link>
        </div>
      </main>
    </div>
  );
}
