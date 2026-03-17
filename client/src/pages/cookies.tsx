import { useLocation } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0F1729] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0F1729]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              NIS2 Prep
            </span>
            <span className="text-xs text-white/40 hidden sm:inline">av Electrab</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Cookiepolicy</h1>
        <p className="text-white/40 text-sm mb-10">Senast uppdaterad: mars 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          {/* 1. Vad är cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Vad är cookies?</h2>
            <p>
              Cookies är små textfiler som lagras i din webbläsare när du besöker en webbplats.
              De används för att webbplatsen ska fungera korrekt och för att komma ihåg dina inställningar.
            </p>
          </section>

          {/* 2. Vilka cookies vi använder */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Vilka cookies använder vi?</h2>
            <p>NIS2 Prep använder enbart nödvändiga cookies:</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-white/90 font-semibold">Cookie</th>
                    <th className="text-left py-2 pr-4 text-white/90 font-semibold">Syfte</th>
                    <th className="text-left py-2 pr-4 text-white/90 font-semibold">Varaktighet</th>
                    <th className="text-left py-2 text-white/90 font-semibold">Typ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-3 pr-4 font-mono text-cyan-400 text-xs">connect.sid</td>
                    <td className="py-3 pr-4">Sessionscookie för inloggning. Håller dig inloggad medan du använder plattformen.</td>
                    <td className="py-3 pr-4">7 dagar</td>
                    <td className="py-3">Nödvändig</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Tredjepartscookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Tredjepartscookies</h2>
            <p>
              Vi använder inga tredjepartscookies för spårning, annonsering eller analys.
              Vid betalning kan Stripe använda egna cookies i sin betalningsprocess — se{" "}
              <a
                href="https://stripe.com/cookie-settings"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                Stripes cookiepolicy
              </a>.
            </p>
          </section>

          {/* 4. Hantera cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Hantera cookies</h2>
            <p>
              Du kan blockera eller radera cookies via din webbläsares inställningar. Observera
              att om du blockerar sessionscookien kommer du inte att kunna logga in på NIS2 Prep.
            </p>
          </section>

          {/* 5. Kontakt */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Kontakt</h2>
            <p>
              Vid frågor om vår användning av cookies, kontakta oss på{" "}
              <a href="mailto:philip.nilsson@electrab.se" className="text-cyan-400 hover:underline">
                philip.nilsson@electrab.se
              </a>.
            </p>
          </section>

          {/* Link to privacy */}
          <section>
            <p>
              Läs även vår{" "}
              <a href="#/privacy" className="text-cyan-400 hover:underline">
                integritetspolicy
              </a>{" "}
              för mer information om hur vi hanterar personuppgifter.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-white/30">
            © 2026 Electrab AB. NIS2 Prep av Electrab.
          </p>
        </div>
      </footer>
    </div>
  );
}
