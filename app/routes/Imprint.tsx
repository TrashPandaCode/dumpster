/*
 * Authors:
 *
 * Purpose:
 */
import Footer from "~/lib/core/components/Footer";
import Header from "~/lib/core/components/Header";

const Imprint = () => {
  return (
    <>
      <Header />

      <main className="flex w-full flex-col gap-12 px-12 pt-16 md:flex-row">
        <div className="prose prose-slate max-w-none flex-1">
          <h1>Impressum</h1>
          <p>Angaben gemäß § 5 TMG</p>
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

          <p>
            <strong>Vertreten durch:</strong>
            <br />
            Prof. TODO
            <br />
            Projektverantwortliche Studierende: TODO
          </p>

          <p>
            <strong>Kontakt:</strong>
            <br />
            E-Mail: TODO
            <br />
            Telefon: TODO
          </p>

          <p>
            <strong>
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
            </strong>
            <br />
            Technische Hochschule Köln
            <br />
            Betzdorfer Straße 2<br />
            50679 Köln
          </p>
        </div>
        <div className="hidden w-px bg-slate-300 md:block" />
        <div className="prose prose-slate max-w-none flex-1">
          <h1>Imprint</h1>
          <p>
            Information in accordance with Section 5 TMG (German Telemedia Act)
          </p>

          <p>
            TH Köln - University of Applied Sciences
            <br />
            Faculty of Information, Media and Electrical Engineering (Fakultät
            für Informations-, Medien- und Elektrotechnik)
            <br />
            Betzdorfer Straße 2<br />
            50679 Cologne
            <br />
            Germany
          </p>

          <p>
            <strong>Represented by:</strong>
            <br />
            Prof. TODO
            <br />
            Project team: TODO
          </p>

          <p>
            <strong>Contact:</strong>
            <br />
            Email: TODO
            <br />
          </p>

          <p>
            <strong>Responsible for content according to § 55 (2) RStV:</strong>
            <br />
            TH Köln
            <br />
            Betzdorfer Straße 2<br />
            50679 Cologne
            <br />
            Germany
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Imprint;
