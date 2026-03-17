import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, CheckCircle2, XCircle, Award, Search, ExternalLink } from "lucide-react";

interface VerifyCertificate {
  id: number;
  userId: number;
  certificateId: string;
  examScore: number;
  totalQuestions: number;
  track: number;
  issuedAt: string;
  userName: string;
  userEmail: string;
}

function VerifyResult({ certId }: { certId: string }) {
  const { data: cert, isLoading, error } = useQuery<VerifyCertificate>({
    queryKey: [`/api/certificates/${certId}`],
    retry: false,
  });

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto" />
            <div className="h-4 w-48 bg-muted mx-auto rounded" />
            <div className="h-4 w-32 bg-muted mx-auto rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !cert) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-destructive">Certifikatet hittades inte</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Inget certifikat med ID <span className="font-mono font-medium">{certId}</span> kunde hittas.
            Kontrollera att ID:t är korrekt och försök igen.
          </p>
        </CardContent>
      </Card>
    );
  }

  const scorePercent = Math.round((cert.examScore / cert.totalQuestions) * 100);
  const dateStr = new Date(cert.issuedAt).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Verified Badge */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
            Verifierat certifikat
          </h2>
          <p className="text-muted-foreground text-sm">
            Detta certifikat är utfärdat av NIS2 Utbildning och verifierat som giltigt.
          </p>
          {cert.track && (
            <p className="text-sm font-medium" style={{ color: cert.track === 1 ? "#00D4FF" : "#0066FF" }}>
              {cert.track === 1 ? "Track 1: Ledning & Styrelse" : "Track 2: All Personal"}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Certificate Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Certifikatuppgifter</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Innehavare</p>
                <p className="font-medium text-lg">{cert.userName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Utfärdat</p>
                <p className="font-medium">{dateStr}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Certifikat-ID</p>
                <p className="font-mono text-sm">{cert.certificateId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Provresultat</p>
                <p className="font-medium">{scorePercent}% ({cert.examScore}/{cert.totalQuestions} rätt)</p>
              </div>
            </div>
            <div className="pt-4 border-t space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Utbildning</p>
              <p className="font-medium">
                NIS2 Cybersäkerhetsutbildning för energisektorn
                {cert.track && ` — ${cert.track === 1 ? "Ledning & Styrelse" : "All Personal"}`}
              </p>
              <p className="text-sm text-muted-foreground">
                I enlighet med EU:s NIS2-direktiv (2022/2555) och Cybersäkerhetslagen (2025:1506)
              </p>
            </div>
            <div className="pt-4 border-t space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Utfärdare</p>
              <p className="font-medium">Electrab AB</p>
              <p className="text-sm text-muted-foreground">via NIS2 Utbildning — nis2utbildning.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  const [, params] = useRoute("/verify/:certId");
  const certIdFromUrl = params?.certId;
  const [searchInput, setSearchInput] = useState("");
  const [searchCertId, setSearchCertId] = useState(certIdFromUrl || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchCertId(searchInput.trim());
      // Also update URL for sharing
      window.history.replaceState(null, "", `/#/verify/${searchInput.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold">NIS2 Utbildning</span>
            <span className="text-xs text-muted-foreground">av Electrab</span>
          </a>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Till utbildningen
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Verifiera certifikat</h1>
          <p className="text-muted-foreground text-sm">
            Ange certifikat-ID för att kontrollera att ett NIS2-certifikat är giltigt.
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Ange certifikat-ID (t.ex. a1b2c3d4-...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="font-mono text-sm"
              />
              <Button type="submit" disabled={!searchInput.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Sök
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        {searchCertId && <VerifyResult certId={searchCertId} />}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6 text-center text-xs text-muted-foreground">
        <p>© 2026 Electrab AB — nis2utbildning.com</p>
      </footer>
    </div>
  );
}
