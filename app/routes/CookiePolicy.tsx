import Footer from "~/lib/core/components/Footer";
import Header from "~/lib/core/components/Header";

const CookiePolicy = () => {
  return (
    <>
      <Header />

      <main className="flex w-full flex-col gap-12 px-12 pt-16 md:flex-row">
        <div className="prose prose-slate max-w-none flex-1">
          <h1>Cookie-Richtlinie</h1>
          <p>
            Diese Website verwendet <strong>keine Cookies</strong> und führt{" "}
            <strong>keine Nutzer-Tracking-Maßnahmen</strong> durch.
          </p>
          <p>
            Ausgenommen sind technisch notwendige Vorgänge, die für den Betrieb
            der Seite erforderlich sind (z.B. Server-Logfiles).
          </p>
        </div>
        <div className="hidden w-px bg-slate-300 md:block" />
        <div className="prose prose-slate max-w-none flex-1">
          <h1>Cookie Policy</h1>

          <p>
            This website does not use cookies or similar tracking technologies.
          </p>
          <p>We do not track users, and we do not collect any usage data.</p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CookiePolicy;
