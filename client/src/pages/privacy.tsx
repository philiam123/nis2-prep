import { useLocation } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0F1729] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0F1729]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              NIS2 Utbildning
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
        <h1 className="text-3xl font-bold mb-2">Integritetspolicy</h1>
        <p className="text-white/40 text-sm mb-10">Senast uppdaterad: mars 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          {/* 1. Personuppgiftsansvarig */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Personuppgiftsansvarig</h2>
            <p>
              Electrab AB ansvarar för behandlingen av dina personuppgifter i samband med
              tjänsten NIS2 Utbildning.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li><span className="text-white/50">Företag:</span> Electrab AB</li>
              <li><span className="text-white/50">E-post:</span>{" "}
                <a href="mailto:philip.nilsson@electrab.se" className="text-cyan-400 hover:underline">
                  philip.nilsson@electrab.se
                </a>
              </li>
            </ul>
          </section>

          {/* 2. Vilka uppgifter samlas in */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Vilka uppgifter samlar vi in?</h2>
            <p>Vi samlar in följande personuppgifter:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
              <li><strong className="text-white/90">Namn</strong> — för att identifiera dig och utfärda certifikat</li>
              <li><strong className="text-white/90">E-postadress</strong> — för inloggning och kommunikation</li>
              <li><strong className="text-white/90">Betalningsinformation</strong> — hanteras av Stripe; vi lagrar aldrig kortuppgifter</li>
              <li><strong className="text-white/90">Studieframsteg</strong> — vilka moduler och kapitel du har slutfört</li>
              <li><strong className="text-white/90">Quizresultat</strong> — poäng och resultat från kunskapstester och slutprov</li>
            </ul>
          </section>

          {/* 3. Rättslig grund */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Rättslig grund</h2>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li>
                <strong className="text-white/90">Avtal</strong> — Vi behandlar dina personuppgifter för att fullgöra
                vårt avtal med dig, det vill säga leverera utbildningen, hantera ditt konto och utfärda certifikat.
              </li>
              <li>
                <strong className="text-white/90">Samtycke</strong> — Cookies för webbplatsens funktion kräver ditt samtycke
                enligt gällande lagstiftning.
              </li>
            </ul>
          </section>

          {/* 4. Lagring */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Hur länge sparas uppgifterna?</h2>
            <p>
              Vi sparar dina personuppgifter så länge ditt konto är aktivt. Om du begär radering
              av ditt konto tar vi bort dina uppgifter inom 30 dagar, med undantag för uppgifter
              som vi enligt lag är skyldiga att spara (t.ex. bokföringsinformation).
            </p>
          </section>

          {/* 5. Tredje parter */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Tredjepartsleverantörer</h2>
            <p>Vi delar personuppgifter med följande tjänsteleverantörer:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
              <li>
                <strong className="text-white/90">Stripe</strong> — betalningshantering. Stripe behandlar
                kortuppgifter i enlighet med PCI DSS. Se{" "}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  Stripes integritetspolicy
                </a>.
              </li>
              <li>
                <strong className="text-white/90">Vercel</strong> — hosting och drift av webbplatsen. Se{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  Vercels integritetspolicy
                </a>.
              </li>
            </ul>
          </section>

          {/* 6. Dina rättigheter */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Dina rättigheter</h2>
            <p>Enligt GDPR har du följande rättigheter:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
              <li><strong className="text-white/90">Åtkomst</strong> — Du har rätt att begära information om vilka uppgifter vi har om dig.</li>
              <li><strong className="text-white/90">Rättelse</strong> — Du kan begära att felaktiga uppgifter korrigeras.</li>
              <li><strong className="text-white/90">Radering</strong> — Du kan begära att dina uppgifter raderas ("rätten att bli bortglömd").</li>
              <li><strong className="text-white/90">Dataportabilitet</strong> — Du kan begära att få dina uppgifter i ett maskinläsbart format.</li>
              <li><strong className="text-white/90">Invändning</strong> — Du kan invända mot viss behandling av dina uppgifter.</li>
            </ul>
            <p className="mt-3">
              Kontakta oss på{" "}
              <a href="mailto:philip.nilsson@electrab.se" className="text-cyan-400 hover:underline">
                philip.nilsson@electrab.se
              </a>{" "}
              för att utöva dina rättigheter. Du har även rätt att lämna klagomål till{" "}
              <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                Integritetsskyddsmyndigheten (IMY)
              </a>.
            </p>
          </section>

          {/* 7. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
            <p>
              Vi använder sessionscookies som är nödvändiga för inloggning och webbplatsens funktion.
              Läs mer i vår{" "}
              <a
                href="#/cookies"
                className="text-cyan-400 hover:underline"
              >
                cookiepolicy
              </a>.
            </p>
          </section>

          {/* 8. Kontakt */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Kontakt</h2>
            <p>
              Vid frågor om vår hantering av personuppgifter, kontakta oss:
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li><span className="text-white/50">E-post:</span>{" "}
                <a href="mailto:philip.nilsson@electrab.se" className="text-cyan-400 hover:underline">
                  philip.nilsson@electrab.se
                </a>
              </li>
              <li><span className="text-white/50">Företag:</span> Electrab AB</li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-white/30">
            © 2026 Electrab AB. NIS2 Utbildning av Electrab.
          </p>
        </div>
      </footer>
    </div>
  );
}
