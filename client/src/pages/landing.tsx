import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Clock, Award, AlertTriangle, BookOpen, HelpCircle, CheckCircle, Zap, Lock, FileText, ArrowRight, Building2, Mail } from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0F1729] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0F1729]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-cyan-400" />
              <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">NIS2 Utbildning</span>
            </div>
            <span className="text-xs text-white/40 hidden sm:inline">av Electrab</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
              data-testid="landing-login-btn"
              onClick={() => navigate("/login")}
            >
              Logga in
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
              data-testid="landing-get-started-btn"
              onClick={() => navigate("/register")}
            >
              Kom igång
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <Zap className="h-4 w-4" />
            <span>Cybersäkerhetslagen i kraft sedan 15 januari 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight break-words">
            NIS2 Utbildning — <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Cybersäkerhets&shy;utbildning
            </span>{" "}
            <br className="hidden sm:block" />
            för energisektorn
          </h1>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Uppfyll kraven i EU:s NIS2-direktiv och den svenska cybersäkerhetslagen (2025:1506).
            Sektoranpassad utbildning med certifikat vid godkänt resultat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 text-lg px-8 py-6"
              data-testid="hero-get-started-btn"
              onClick={() => navigate("/register")}
            >
              Starta utbildningen <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
              onClick={() => scrollTo("tracks")}
            >
              Se kursinnehåll
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "+70%", label: "Ökning av cyberattacker mot energisektorn 2024", icon: AlertTriangle },
              { value: "~115 MSEK", label: "Böter vid bristande efterlevnad", icon: Lock },
              { value: "11", label: "Utbildningsavsnitt", icon: BookOpen },
              { value: "100+", label: "Quizfrågor med förklaringar", icon: HelpCircle },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-3 text-cyan-400" />
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Tracks */}
      <section id="tracks" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Två utbildningsspår</h2>
          <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
            Kursen är uppdelad i två spår — ett för ledning och styrelse, ett för all personal.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/[0.03] border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Shield className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Spår 1: Ledning & Styrelse</h3>
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <Clock className="h-3.5 w-3.5" /> ~40 minuter • Gemensam + Ledning + Personal
                    </div>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-4">
                  {[
                    "Gemensam: Vad är NIS2?",
                    "Gemensam: Omfattas vi?",
                    "Gemensam: De 10 säkerhetsåtgärderna",
                    "Gemensam: Cyberhot i energisektorn",
                    "Ledningens ansvar",
                    "Incidentrapportering",
                    "Leverantörs- och supply chain-säkerhet",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-cyan-400/70 mb-1">
                  Inkluderar även Personal-avsnitten — slutprovet innehåller 5 frågor från dessa.
                </p>
                <p className="text-xs text-white/40">
                  Riktat till VD, styrelse, ledningsgrupp och beslutsfattare.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-blue-500/20 hover:border-blue-500/40 transition-colors">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Spår 2: All Personal</h3>
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <Clock className="h-3.5 w-3.5" /> ~50 minuter • Gemensam + 4 avsnitt
                    </div>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-4">
                  {[
                    "Gemensam: Vad är NIS2?",
                    "Gemensam: Omfattas vi?",
                    "Gemensam: De 10 säkerhetsåtgärderna",
                    "Gemensam: Cyberhot i energisektorn",
                    "Lösenord och autentisering",
                    "Phishing och social engineering",
                    "Incidenthantering i praktiken",
                    "IT/OT, fysisk säkerhet & kryptografi",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle className="h-4 w-4 text-blue-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-white/40">
                  Riktat till alla medarbetare i organisationen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Selling Points */}
      <section className="py-20 px-4 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Varför NIS2 Utbildning?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Uppfyller cybersäkerhetslagens krav",
                desc: "Utbildningen uppfyller kraven i 4 § Cybersäkerhetslagen (2025:1506) om ledningens utbildningsskyldighet.",
              },
              {
                icon: Award,
                title: "Certifikat vid godkänt resultat",
                desc: "Slutför utbildningen och klara slutprovet med minst 70% för att få ett personligt kurscertifikat.",
              },
              {
                icon: Zap,
                title: "Sektoranpassat för energibranschen",
                desc: "Allt innehåll är anpassat för energisektorn med relevanta exempel, hotbilder och OT-säkerhet.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="bg-white/[0.03] border-white/10">
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-cyan-400 mb-4" />
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Allt du behöver</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Interaktivt kursmaterial",
                desc: "11 avsnitt med strukturerat innehåll anpassat för energisektorn. Gemensam introduktion + spårspecifika avsnitt. Markera avsnitt som klara och följ din progress.",
              },
              {
                icon: HelpCircle,
                title: "100+ quizfrågor",
                desc: "Öva med frågor från alla kursdelar eller gör ett fullständigt slutprov. Detaljerade förklaringar på varje fråga.",
              },
              {
                icon: Award,
                title: "Digitalt certifikat",
                desc: "Klara slutprovet med minst 70% och få ett personligt certifikat med unikt ID som bevis på genomförd utbildning.",
              },
              {
                icon: FileText,
                title: "NIS2-rapporteringsguide",
                desc: "Tidsfrister, kontaktuppgifter och steg-för-steg-guide för incidentrapportering enligt NIS2.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="bg-white/[0.03] border-white/10">
                <CardContent className="pt-6 flex items-start gap-4">
                  <feature.icon className="h-8 w-8 text-cyan-400 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Enkel prissättning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Individ */}
            <Card className="bg-white/[0.03] border-cyan-500/30">
              <CardContent className="pt-8 pb-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-4">Individ</div>
                <div className="text-5xl font-bold mb-1">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">1 490 kr</span>
                </div>
                <div className="text-white/50 mb-8">Per person. Engångsbetalning.</div>
                <ul className="text-left mb-8 space-y-3 max-w-xs mx-auto">
                  {[
                    "11 utbildningsavsnitt",
                    "100+ quizfrågor med förklaringar",
                    "Slutprov med certifikat",
                    "Anpassat för energisektorn",
                    "Uppfyller Cybersäkerhetslagens krav",
                    "Obegränsad tillgång",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span className="text-sm text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                  data-testid="pricing-get-started-btn"
                  onClick={() => navigate("/register")}
                >
                  Starta utbildningen
                </Button>
              </CardContent>
            </Card>

            {/* Företag */}
            <Card className="border-white/20 bg-white/5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Populärt
                </span>
              </div>
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Företag</span>
                </div>
                <div className="text-3xl font-bold mb-1 text-white">Kontakta oss</div>
                <div className="text-white/50 mb-8">Anpassat pris för er organisation.</div>
                <ul className="text-left mb-8 space-y-3 max-w-xs mx-auto">
                  {[
                    "Anpassat pris vid 5+ licenser",
                    "Samlad faktura",
                    "Uppföljning av kursframsteg",
                    "Dedikerad support",
                    "Skräddarsydda avsnitt",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span className="text-sm text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <a href="mailto:philip.nilsson@electrab.se?subject=NIS2%20F%C3%B6retagslicens">
                    <Mail className="mr-2 h-4 w-4" />
                    Kontakta oss
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-4">
            <a href="#/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">Integritetspolicy</a>
            <span className="text-white/20">·</span>
            <a href="#/cookies" className="text-xs text-white/40 hover:text-white/70 transition-colors">Cookiepolicy</a>
            <span className="text-white/20">·</span>
            <a href="mailto:philip.nilsson@electrab.se" className="text-xs text-white/40 hover:text-white/70 transition-colors">Kontakt</a>
          </div>
          <p className="text-xs text-white/30">
            © 2026 Electrab AB. NIS2 Utbildning är en utbildningsplattform för cybersäkerhet baserad på EU:s NIS2-direktiv (2022/2555) och
            den svenska Cybersäkerhetslagen (2025:1506). Utbildningen ersätter inte juridisk rådgivning.
          </p>
        </div>
      </footer>
    </div>
  );
}
