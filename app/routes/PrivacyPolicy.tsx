/*
 * Authors:
 *
 * Purpose:
 */
import Footer from "~/lib/core/components/Footer";
import Header from "~/lib/core/components/Header";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />

      <main className="flex w-full flex-col gap-12 px-12 pt-16 md:flex-row">
        <div className="prose prose-slate max-w-none flex-1">
          <h1>Datenschutzerklärung</h1>

          <p>
            Wir nehmen den Schutz Ihrer persönlichen Daten ernst. Diese Website
            ist ein studentisches Projekt der TH Köln und verfolgt keine
            kommerziellen Zwecke.
          </p>

          <h2>Verantwortliche Stelle</h2>
          <p>
            Technische Hochschule Köln
            <br />
            Fakultät für Informations-, Medien- und Elektrotechnik
            <br />
            Betzdorfer Straße 2<br />
            50679 Köln
            <br />
            Deutschland
          </p>

          <h2>Hosting</h2>
          <p>
            Diese Website wird von <strong>Vercel Inc.</strong> gehostet. Vercel
            ist ein US-amerikanisches Unternehmen mit Hosting-Standorten auch
            innerhalb der EU. Es kann technisch bedingt zu einer Übertragung
            personenbezogener Daten (z.B. IP-Adressen) in Drittstaaten kommen.
            <br />
            Vercel ist unter dem <em>Data Privacy Framework</em> zertifiziert
            und bietet damit ein angemessenes Datenschutzniveau gemäß Art. 45
            DSGVO.
          </p>

          <h2>Erhebung personenbezogener Daten</h2>
          <p>
            Diese Website speichert oder verarbeitet{" "}
            <strong>keine personenbezogenen Daten</strong> aktiv. Es gibt:
          </p>
          <ul>
            <li>Keine Nutzerkonten</li>
            <li>Keine Formulareingaben</li>
            <li>Keine Newsletter</li>
          </ul>

          <h2>Verwendung von Google Fonts</h2>
          <p>
            Diese Website verwendet{" "}
            <strong>selbst gehostete Schriftarten</strong> (Google Fonts). Es
            erfolgt <strong>keine Verbindung zu Servern von Google</strong>,
            daher werden auch keine personenbezogenen Daten an Google
            übermittelt.
          </p>

          <h2>Cookies</h2>
          <p>
            Diese Website verwendet <strong>keine Cookies</strong>.
          </p>

          <h2>Ihre Rechte</h2>
          <ul>
            <li>Auskunft (Art. 15 DSGVO)</li>
            <li>Berichtigung (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
          </ul>

          <p>
            Zuständige Aufsichtsbehörde:
            <br />
            Landesbeauftragte für Datenschutz und Informationsfreiheit NRW
            <br />
            <a
              href="https://www.ldi.nrw.de/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.ldi.nrw.de
            </a>
          </p>

          <h2>Kontakt</h2>
          <p>
            Bei Fragen zum Datenschutz wenden Sie sich bitte an:
            <br />
            TODO
          </p>
        </div>
        <div className="hidden w-px bg-slate-300 md:block" />
        <div className="prose prose-slate max-w-none flex-1">
          <h1>Privacy Policy</h1>

          <p>
            We take the protection of your personal data seriously. This website
            is a university student project at TH Köln and serves educational,
            non-commercial purposes.
          </p>

          <h2>Responsible Entity</h2>
          <p>
            TH Köln - University of Applied Sciences
            <br />
            Faculty of Information, Media and Electrical Engineering
            <br />
            Betzdorfer Straße 2<br />
            50679 Cologne, Germany
          </p>

          <h2>Hosting</h2>
          <p>
            This website is hosted on <strong>Vercel</strong>. Vercel uses
            servers in the EU and the USA. While technical data such as IP
            addresses may be processed, Vercel complies with GDPR through the
            Data Privacy Framework (DPF).
          </p>

          <h2>Personal Data</h2>
          <p>This website does not collect personal data. There are:</p>
          <ul>
            <li>No contact forms</li>
            <li>No user accounts or logins</li>
            <li>No newsletter subscriptions</li>
          </ul>

          <h2>Fonts</h2>
          <p>
            We use <strong>self-hosted Google Fonts</strong>. No connections to
            Google's servers are made, and no personal data is transmitted to
            Google.
          </p>

          <h2>Cookies</h2>
          <p>
            This site <strong>does not use cookies</strong>.
          </p>

          <h2>Your Rights under GDPR</h2>
          <ul>
            <li>Right to access (Art. 15)</li>
            <li>Right to rectification (Art. 16)</li>
            <li>Right to erasure (Art. 17)</li>
            <li>Right to restriction of processing (Art. 18)</li>
            <li>Right to data portability (Art. 20)</li>
            <li>
              Right to lodge a complaint with a supervisory authority (Art. 77)
            </li>
          </ul>

          <p>
            Supervisory authority:
            <br />
            State Commissioner for Data Protection and Freedom of Information of
            North Rhine-Westphalia (LDI NRW)
            <br />
            <a
              href="https://www.ldi.nrw.de/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.ldi.nrw.de/
            </a>
          </p>

          <h2>Contact</h2>
          <p>For questions regarding privacy, contact: TODO</p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
