'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';

export default function DatenschutzPage() {
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
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Datenschutzerklärung</h1>
        <p className="text-stone-500 mb-8">Stand: Februar 2026</p>

        <div className="prose prose-stone max-w-none space-y-8">
          {/* Einleitung */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="text-lg font-medium text-stone-800 mt-4 mb-2">
              Allgemeine Hinweise
            </h3>
            <p className="text-stone-700">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit
              Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
              Personenbezogene Daten sind alle Daten, mit denen Sie persönlich
              identifiziert werden können. Ausführliche Informationen zum Thema
              Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten
              Datenschutzerklärung.
            </p>
          </section>

          {/* Verantwortlicher */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              2. Verantwortlicher
            </h2>
            <p className="text-stone-700">
              Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="text-stone-700 mt-2">
              Kai Böhm<br />
              Am Sportplatz 14<br />
              29633 Munster<br />
              Deutschland
            </p>
            <p className="text-stone-700 mt-2">
              E-Mail:{' '}
              <a
                href="mailto:support@maiflow.app"
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                support@maiflow.app
              </a>
            </p>
            <p className="text-stone-700 mt-4">
              Verantwortliche Stelle ist die natürliche oder juristische Person, die
              allein oder gemeinsam mit anderen über die Zwecke und Mittel der
              Verarbeitung von personenbezogenen Daten (z.B. Namen, E-Mail-Adressen
              o.Ä.) entscheidet.
            </p>
          </section>

          {/* Datenerfassung */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              3. Datenerfassung auf dieser Website
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mt-4 mb-2">
              Wie erfassen wir Ihre Daten?
            </h3>
            <p className="text-stone-700">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
              mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie bei der
              Registrierung oder beim Login eingeben.
            </p>
            <p className="text-stone-700 mt-2">
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
              Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem
              technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des
              Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald
              Sie diese Website betreten.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mt-4 mb-2">
              Wofür nutzen wir Ihre Daten?
            </h3>
            <p className="text-stone-700">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der
              Website zu gewährleisten. Andere Daten können zur Analyse Ihres
              Nutzerverhaltens verwendet werden. Hauptsächlich nutzen wir Ihre Daten,
              um Ihnen unseren Dienst zur Kampagnenplanung bereitzustellen.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mt-4 mb-2">
              Welche Rechte haben Sie bezüglich Ihrer Daten?
            </h3>
            <p className="text-stone-700">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
              Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu
              erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung
              dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur
              Datenverarbeitung erteilt haben, können Sie diese Einwilligung
              jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht,
              unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer
              personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein
              Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
            </p>
            <p className="text-stone-700 mt-2">
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich
              jederzeit an uns wenden.
            </p>
          </section>

          {/* Hosting */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              4. Hosting
            </h2>
            <p className="text-stone-700">
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
            </p>

            <h3 className="text-lg font-medium text-stone-800 mt-4 mb-2">Vercel</h3>
            <p className="text-stone-700">
              Anbieter ist die Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
              USA (nachfolgend „Vercel").
            </p>
            <p className="text-stone-700 mt-2">
              Wenn Sie unsere Website besuchen, werden Ihre personenbezogenen Daten
              auf den Servern von Vercel verarbeitet. Hierbei können auch
              personenbezogene Daten an den Mutterkonzern von Vercel in die USA
              übermittelt werden. Die Datenübertragung in die USA wird auf die
              EU-Standardvertragsklauseln gestützt. Details finden Sie hier:{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                https://vercel.com/legal/privacy-policy
              </a>
            </p>
            <p className="text-stone-700 mt-2">
              Die Verwendung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit.
              f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst
              zuverlässigen Darstellung unserer Website.
            </p>
          </section>

          {/* Firebase */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              5. Cloud-Dienste und Datenbanken
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mt-4 mb-2">
              Google Firebase
            </h3>
            <p className="text-stone-700">
              Wir nutzen die Dienste von Google Firebase für Authentifizierung und
              Datenspeicherung. Anbieter ist Google Ireland Limited, Gordon House,
              Barrow Street, Dublin 4, Irland.
            </p>
            <p className="text-stone-700 mt-2">
              <strong>Firebase Authentication:</strong> Für die Benutzeranmeldung und
              -verwaltung nutzen wir Firebase Authentication. Dabei werden folgende
              Daten verarbeitet:
            </p>
            <ul className="list-disc list-inside text-stone-700 mt-2 space-y-1">
              <li>E-Mail-Adresse</li>
              <li>Passwort (verschlüsselt gespeichert)</li>
              <li>Anzeigename (optional)</li>
              <li>Zeitpunkt der Registrierung und des letzten Logins</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="text-stone-700 mt-2">
              <strong>Cloud Firestore:</strong> Für die Speicherung Ihrer
              Kampagnendaten nutzen wir Cloud Firestore. Dabei werden Ihre
              Projektdaten, Kampagnen, Einstellungen und Teammitgliedschaften
              gespeichert.
            </p>
            <p className="text-stone-700 mt-2">
              Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b
              DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
              Interesse). Google ist unter dem EU-US Data Privacy Framework
              zertifiziert. Weitere Informationen finden Sie unter:{' '}
              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                https://firebase.google.com/support/privacy
              </a>
            </p>
          </section>

          {/* Benutzerkonten */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              6. Benutzerkonten
            </h2>
            <p className="text-stone-700">
              Sie können auf unserer Website ein Benutzerkonto anlegen. Wenn Sie
              diese Option nutzen, werden folgende Daten gespeichert:
            </p>
            <ul className="list-disc list-inside text-stone-700 mt-2 space-y-1">
              <li>E-Mail-Adresse</li>
              <li>Passwort (verschlüsselt)</li>
              <li>Anzeigename (optional)</li>
              <li>Erstellungsdatum des Kontos</li>
              <li>Von Ihnen erstellte Projekte und Kampagnen</li>
              <li>Projektmitgliedschaften und -einladungen</li>
            </ul>
            <p className="text-stone-700 mt-2">
              Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs.
              1 lit. a DSGVO) und ist zur Vertragserfüllung erforderlich (Art. 6 Abs.
              1 lit. b DSGVO). Sie können Ihr Konto jederzeit löschen. Kontaktieren
              Sie uns dazu unter{' '}
              <a
                href="mailto:support@maiflow.app"
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                support@maiflow.app
              </a>
              .
            </p>
          </section>

          {/* E-Mail-Kommunikation */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              7. E-Mail-Kommunikation
            </h2>
            <p className="text-stone-700">
              Wir versenden folgende E-Mails an Sie:
            </p>
            <ul className="list-disc list-inside text-stone-700 mt-2 space-y-1">
              <li>
                <strong>Transaktionale E-Mails:</strong> Passwort-Zurücksetzen,
                E-Mail-Verifizierung, Projekteinladungen
              </li>
            </ul>
            <p className="text-stone-700 mt-2">
              Diese E-Mails werden über Firebase Authentication versendet und sind
              für die Nutzung des Dienstes erforderlich. Die Rechtsgrundlage ist Art.
              6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              8. Cookies und lokale Speicherung
            </h2>
            <p className="text-stone-700">
              Unsere Website verwendet Cookies und lokale Speicherung (localStorage)
              für folgende Zwecke:
            </p>
            <ul className="list-disc list-inside text-stone-700 mt-2 space-y-1">
              <li>
                <strong>Authentifizierung:</strong> Firebase speichert
                Authentifizierungstokens, um Sie angemeldet zu halten
              </li>
              <li>
                <strong>Funktionalität:</strong> Speicherung von Benutzereinstellungen
                und temporären Daten für die Anwendung
              </li>
            </ul>
            <p className="text-stone-700 mt-2">
              Diese Speicherung ist technisch notwendig und erfolgt auf Grundlage von
              Art. 6 Abs. 1 lit. f DSGVO. Sie können Ihren Browser so einstellen,
              dass Sie über das Setzen von Cookies informiert werden und Cookies nur
              im Einzelfall erlauben. Bei der Deaktivierung von Cookies kann die
              Funktionalität unserer Website eingeschränkt sein.
            </p>
          </section>

          {/* Ihre Rechte */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              9. Ihre Rechte
            </h2>
            <p className="text-stone-700">
              Sie haben folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:
            </p>
            <ul className="list-disc list-inside text-stone-700 mt-2 space-y-1">
              <li>
                <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie haben das Recht,
                Auskunft über Ihre gespeicherten Daten zu erhalten
              </li>
              <li>
                <strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie haben das
                Recht auf Berichtigung unrichtiger Daten
              </li>
              <li>
                <strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie haben das Recht
                auf Löschung Ihrer Daten („Recht auf Vergessenwerden")
              </li>
              <li>
                <strong>Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie
                haben das Recht, die Einschränkung der Verarbeitung zu verlangen
              </li>
              <li>
                <strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das
                Recht, Ihre Daten in einem strukturierten Format zu erhalten
              </li>
              <li>
                <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie haben das
                Recht, der Verarbeitung Ihrer Daten zu widersprechen
              </li>
              <li>
                <strong>Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Sie
                können eine erteilte Einwilligung jederzeit widerrufen
              </li>
              <li>
                <strong>Beschwerderecht (Art. 77 DSGVO):</strong> Sie haben das Recht,
                sich bei einer Aufsichtsbehörde zu beschweren
              </li>
            </ul>
            <p className="text-stone-700 mt-4">
              Um Ihre Rechte auszuüben, kontaktieren Sie uns bitte unter{' '}
              <a
                href="mailto:support@maiflow.app"
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                support@maiflow.app
              </a>
              .
            </p>
          </section>

          {/* Datensicherheit */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              10. Datensicherheit
            </h2>
            <p className="text-stone-700">
              Diese Website nutzt aus Sicherheitsgründen und zum Schutz der
              Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung.
              Eine verschlüsselte Verbindung erkennen Sie daran, dass die
              Adresszeile des Browsers von „http://" auf „https://" wechselt und an
              dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
            <p className="text-stone-700 mt-2">
              Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten,
              die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
            </p>
          </section>

          {/* Datenspeicherung */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              11. Speicherdauer
            </h2>
            <p className="text-stone-700">
              Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die
              Erfüllung der Zwecke, für die sie erhoben wurden, erforderlich ist oder
              solange gesetzliche Aufbewahrungsfristen dies vorschreiben.
            </p>
            <ul className="list-disc list-inside text-stone-700 mt-2 space-y-1">
              <li>
                <strong>Kontodaten:</strong> Werden gespeichert, solange Ihr Konto
                aktiv ist. Nach Löschung des Kontos werden die Daten innerhalb von 30
                Tagen gelöscht.
              </li>
              <li>
                <strong>Projektdaten:</strong> Werden gespeichert, solange das Projekt
                existiert. Bei Löschung eines Projekts werden alle zugehörigen Daten
                gelöscht.
              </li>
              <li>
                <strong>Server-Logs:</strong> Werden nach maximal 90 Tagen gelöscht.
              </li>
            </ul>
          </section>

          {/* Änderungen */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              12. Änderungen dieser Datenschutzerklärung
            </h2>
            <p className="text-stone-700">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie
              stets den aktuellen rechtlichen Anforderungen entspricht oder um
              Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen,
              z.B. bei der Einführung neuer Services. Für Ihren erneuten Besuch gilt
              dann die neue Datenschutzerklärung.
            </p>
          </section>

          {/* Aufsichtsbehörde */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              13. Zuständige Aufsichtsbehörde
            </h2>
            <p className="text-stone-700">
              Die zuständige Aufsichtsbehörde für datenschutzrechtliche Fragen ist:
            </p>
            <p className="text-stone-700 mt-2">
              Die Landesbeauftragte für den Datenschutz Niedersachsen<br />
              Prinzenstraße 5<br />
              30159 Hannover<br />
              Telefon: 0511 120-4500<br />
              E-Mail: poststelle@lfd.niedersachsen.de<br />
              Website:{' '}
              <a
                href="https://www.lfd.niedersachsen.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                www.lfd.niedersachsen.de
              </a>
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-stone-200 flex gap-6 text-sm">
          <Link
            href="/impressum"
            className="text-stone-500 hover:text-rose-500 transition-colors"
          >
            Impressum
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
