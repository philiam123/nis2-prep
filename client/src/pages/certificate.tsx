import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Download, HelpCircle, Shield } from "lucide-react";

interface CertificateData {
  id: number;
  userId: number;
  certificateId: string;
  examScore: number;
  totalQuestions: number;
  issuedAt: string;
}

export default function CertificatePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: certificates = [], isLoading } = useQuery<CertificateData[]>({
    queryKey: ["/api/certificates"],
  });

  const latestCert = certificates.length > 0
    ? certificates.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())[0]
    : null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !latestCert) return;

    const scorePercent = Math.round((latestCert.examScore / latestCert.totalQuestions) * 100);
    const dateStr = new Date(latestCert.issuedAt).toLocaleDateString("sv-SE", {
      year: "numeric", month: "long", day: "numeric"
    });

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>NIS2 Certifikat — ${user?.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0F1729; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .certificate {
      width: 800px; padding: 60px; background: linear-gradient(135deg, #0F1729 0%, #1a2744 100%);
      border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; color: white; position: relative;
    }
    .certificate::before {
      content: ''; position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px;
      border: 1px solid rgba(0, 212, 255, 0.1); border-radius: 12px; pointer-events: none;
    }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; }
    .logo svg { width: 32px; height: 32px; }
    .logo-text { font-size: 18px; font-weight: 700; background: linear-gradient(to right, #00D4FF, #0066FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .title { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
    .subtitle { color: rgba(255,255,255,0.5); font-size: 14px; }
    .main { text-align: center; margin: 40px 0; }
    .label { color: rgba(255,255,255,0.4); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
    .name { font-size: 36px; font-weight: 600; background: linear-gradient(to right, #00D4FF, #0066FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 32px; }
    .course { font-size: 16px; color: rgba(255,255,255,0.7); margin-bottom: 8px; }
    .details { display: flex; justify-content: center; gap: 48px; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); }
    .detail { text-align: center; }
    .detail-value { font-size: 18px; font-weight: 600; color: #00D4FF; }
    .detail-label { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 4px; }
    .footer { text-align: center; margin-top: 40px; color: rgba(255,255,255,0.3); font-size: 11px; }
    .cert-id { font-family: monospace; color: rgba(255,255,255,0.2); }
    @media print { body { background: white; } .certificate { width: 100%; border-color: #0066FF; } }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="#00D4FF" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span class="logo-text">NIS2 Prep</span>
      </div>
      <div class="title">Kurscertifikat</div>
      <div class="subtitle">NIS2 Cybersäkerhetsutbildning för energisektorn</div>
    </div>
    <div class="main">
      <div class="label">Härmed intygas att</div>
      <div class="name">${user?.name || "Deltagare"}</div>
      <div class="course">har genomfört NIS2 Cybersäkerhetsutbildning</div>
      <div class="course">i enlighet med EU:s NIS2-direktiv (2022/2555)</div>
      <div class="course">och Cybersäkerhetslagen (2025:1506)</div>
    </div>
    <div class="details">
      <div class="detail">
        <div class="detail-value">${scorePercent}%</div>
        <div class="detail-label">Provresultat</div>
      </div>
      <div class="detail">
        <div class="detail-value">${latestCert.examScore}/${latestCert.totalQuestions}</div>
        <div class="detail-label">Rätta svar</div>
      </div>
      <div class="detail">
        <div class="detail-value">${dateStr}</div>
        <div class="detail-label">Utfärdat</div>
      </div>
    </div>
    <div class="footer">
      <p>© 2026 Electrab AB</p>
      <p class="cert-id" style="margin-top: 8px;">Certifikat-ID: ${latestCert.certificateId}</p>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <p className="text-muted-foreground">Laddar...</p>
      </div>
    );
  }

  if (!latestCert) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Certifikat</h1>
        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <Award className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">Inget certifikat ännu</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Slutför slutprovet med minst 70% rätt för att få ditt personliga kurscertifikat
              för NIS2 Cybersäkerhetsutbildning.
            </p>
            <Button onClick={() => navigate("/quiz?mode=exam")} data-testid="certificate-go-to-quiz">
              <Award className="mr-2 h-4 w-4" />
              Påbörja slutprov
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scorePercent = Math.round((latestCert.examScore / latestCert.totalQuestions) * 100);
  const dateStr = new Date(latestCert.issuedAt).toLocaleDateString("sv-SE", {
    year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Ditt certifikat</h1>

      {/* Certificate Preview */}
      <Card className="bg-gradient-to-br from-[#0F1729] to-[#1a2744] border-cyan-500/30 text-white overflow-hidden">
        <CardContent className="pt-8 pb-8 text-center relative">
          <div className="absolute inset-4 border border-cyan-500/10 rounded-lg pointer-events-none" />
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              NIS2 Prep
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Kurscertifikat</h2>
          <p className="text-white/50 text-sm mb-6">
            NIS2 Cybersäkerhetsutbildning för energisektorn
          </p>

          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Härmed intygas att</p>
          <p className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
            {user?.name}
          </p>

          <p className="text-white/60 text-sm">har genomfört NIS2 Cybersäkerhetsutbildning</p>
          <p className="text-white/60 text-sm">i enlighet med Cybersäkerhetslagen (2025:1506)</p>

          <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-400">{scorePercent}%</p>
              <p className="text-xs text-white/40">Provresultat</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-400">{latestCert.examScore}/{latestCert.totalQuestions}</p>
              <p className="text-xs text-white/40">Rätta svar</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-400">{dateStr}</p>
              <p className="text-xs text-white/40">Utfärdat</p>
            </div>
          </div>

          <div className="mt-6 text-white/20 text-xs">
            <p>© 2026 Electrab AB</p>
            <p className="font-mono mt-1">Certifikat-ID: {latestCert.certificateId}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handlePrint} data-testid="certificate-download">
          <Download className="mr-2 h-4 w-4" />
          Ladda ner / Skriv ut
        </Button>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Tillbaka till dashboard
        </Button>
      </div>

      {/* Certificate Details */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Certifikatuppgifter</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Namn</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">E-post</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certifikat-ID</span>
              <span className="font-mono text-xs">{latestCert.certificateId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resultat</span>
              <span className="font-medium">{scorePercent}% ({latestCert.examScore}/{latestCert.totalQuestions})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Utfärdat</span>
              <span className="font-medium">{dateStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Utbildning</span>
              <span className="font-medium">NIS2 Cybersäkerhetsutbildning</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
