import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Download, Shield, QrCode, ExternalLink, Copy, Check, Users, GraduationCap } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState, useCallback } from "react";
import QRCode from "qrcode";

interface CertificateData {
  id: number;
  userId: number;
  certificateId: string;
  examScore: number;
  totalQuestions: number;
  track: number;
  issuedAt: string;
}

function getTrackName(track: number): string {
  return track === 1 ? "Ledning & Styrelse" : "All Personal";
}

function getTrackLabel(track: number): string {
  return track === 1 ? "Spår 1: Ledning & Styrelse" : "Spår 2: All Personal";
}

function getTrackColor(track: number): string {
  return track === 1 ? "#00D4FF" : "#0066FF";
}

function CertificateCard({ cert, user, onPrint }: { cert: CertificateData; user: any; onPrint: (cert: CertificateData) => void }) {
  const VERIFY_BASE = "https://nis2utbildning.com/#/verify";
  const verifyUrl = `${VERIFY_BASE}/${cert.certificateId}`;
  const [copied, setCopied] = useState(false);
  const [, navigate] = useLocation();

  const scorePercent = Math.round((cert.examScore / cert.totalQuestions) * 100);
  const dateStr = new Date(cert.issuedAt).toLocaleDateString("sv-SE", {
    year: "numeric", month: "long", day: "numeric"
  });
  const trackName = getTrackName(cert.track);
  const trackColor = getTrackColor(cert.track);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Certificate Preview */}
      <Card className="bg-gradient-to-br from-[#0F1729] to-[#1a2744] border-cyan-500/30 text-white overflow-hidden">
        <CardContent className="pt-8 pb-8 text-center relative">
          <div className="absolute inset-4 border border-cyan-500/10 rounded-lg pointer-events-none" />

          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              NIS2 Utbildning
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Kurscertifikat</h2>
          <p className="text-white/50 text-sm mb-2">
            NIS2 Cybersäkerhetsutbildning för energisektorn
          </p>
          <p className="text-sm font-medium mb-6" style={{ color: trackColor }}>
            {trackName}
          </p>

          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Härmed intygas att</p>
          <p className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
            {user?.name}
          </p>

          <p className="text-white/60 text-sm">har genomfört NIS2 Cybersäkerhetsutbildning</p>
          <p className="text-white/60 text-sm">— {trackName}</p>
          <p className="text-white/60 text-sm">i enlighet med Cybersäkerhetslagen (2025:1506)</p>

          <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-400">{scorePercent}%</p>
              <p className="text-xs text-white/40">Provresultat</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-400">{cert.examScore}/{cert.totalQuestions}</p>
              <p className="text-xs text-white/40">Rätta svar</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-cyan-400">{dateStr}</p>
              <p className="text-xs text-white/40">Utfärdat</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-white/20 text-xs">&copy; 2026 Electrab AB</p>
              <p className="font-mono mt-1 text-white/20 text-xs">Certifikat-ID: {cert.certificateId}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-white/10 p-2 rounded-lg">
                <QRCodeSVG
                  value={verifyUrl}
                  size={64}
                  bgColor="transparent"
                  fgColor="#22d3ee"
                  level="M"
                />
              </div>
              <span className="text-[9px] text-white/30">Skanna för att verifiera</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => onPrint(cert)}>
          <Download className="mr-2 h-4 w-4" />
          Ladda ner / Skriv ut
        </Button>
        <Button variant="outline" onClick={handleCopyLink}>
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? "Kopierad!" : "Kopiera verifieringslänk"}
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
              <span className="text-muted-foreground">Utbildningsspår</span>
              <span className="font-medium" style={{ color: trackColor }}>{trackName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certifikat-ID</span>
              <span className="font-mono text-xs">{cert.certificateId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resultat</span>
              <span className="font-medium">{scorePercent}% ({cert.examScore}/{cert.totalQuestions})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Utfärdat</span>
              <span className="font-medium">{dateStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Utbildning</span>
              <span className="font-medium">NIS2 Cybersäkerhetsutbildning — {trackName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Verifiering</span>
              <a
                href={`/#/verify/${cert.certificateId}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Verifiera certifikat
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CertificatePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: certificates = [], isLoading } = useQuery<CertificateData[]>({
    queryKey: ["/api/certificates"],
  });

  const track1Cert = certificates.find(c => c.track === 1);
  const track2Cert = certificates.find(c => c.track === 2);
  const hasCerts = certificates.length > 0;

  const handlePrint = useCallback(async (cert: CertificateData) => {
    const scorePercent = Math.round((cert.examScore / cert.totalQuestions) * 100);
    const dateStr = new Date(cert.issuedAt).toLocaleDateString("sv-SE", {
      year: "numeric", month: "long", day: "numeric"
    });
    const trackName = getTrackName(cert.track);
    const trackColor = getTrackColor(cert.track);
    const verifyUrl = `https://nis2utbildning.com/#/verify/${cert.certificateId}`;
    const userName = user?.name || "Deltagare";

    // Generate a real QR code SVG string
    let qrSvg = "";
    try {
      qrSvg = await QRCode.toString(verifyUrl, {
        type: "svg",
        width: 64,
        margin: 1,
        color: { dark: "#22d3ee", light: "#00000000" },
      });
    } catch {
      qrSvg = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="6" fill="rgba(255,255,255,0.1)"/><text x="32" y="32" text-anchor="middle" dominant-baseline="middle" fill="#00D4FF" font-size="7" font-family="monospace">QR</text></svg>`;
    }

    // A4 = 210mm x 297mm. We use @page + mm units so it fits exactly on one page.
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>NIS2 Certifikat \u2014 ${userName} \u2014 ${trackName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;height:297mm;overflow:hidden}
body{font-family:'DM Sans',sans-serif;background:#0F1729;display:flex;flex-direction:column;align-items:center;justify-content:center}
.page{width:210mm;height:297mm;padding:18mm 20mm;background:linear-gradient(135deg,#0F1729,#1a2744);color:#fff;position:relative;display:flex;flex-direction:column;justify-content:center}
.page::before{content:'';position:absolute;top:12mm;left:12mm;right:12mm;bottom:12mm;border:1px solid rgba(0,212,255,0.15);border-radius:8px;pointer-events:none}
.hdr{text-align:center;margin-bottom:24px}
.logo{display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:10px}
.logo svg{width:26px;height:26px}
.logo-t{font-size:15px;font-weight:700;background:linear-gradient(to right,#00D4FF,#0066FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ttl{font-size:28px;font-weight:700;margin-bottom:4px}
.sub{color:rgba(255,255,255,0.5);font-size:12px}
.trk{font-size:13px;font-weight:600;color:${trackColor};margin-top:6px}
.main{text-align:center;margin:28px 0}
.lbl{color:rgba(255,255,255,0.4);font-size:10px;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
.nm{font-size:30px;font-weight:600;background:linear-gradient(to right,#00D4FF,#0066FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:20px}
.crs{font-size:13px;color:rgba(255,255,255,0.7);margin-bottom:6px}
.dts{display:flex;justify-content:center;gap:40px;margin-top:28px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.1)}
.dt{text-align:center}
.dv{font-size:16px;font-weight:600;color:#00D4FF}
.dl{font-size:9px;color:rgba(255,255,255,0.4);margin-top:3px}
.ftr{text-align:center;margin-top:28px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.3);font-size:10px;display:flex;align-items:center;justify-content:center;gap:24px}
.ftr-t{text-align:center}
.cid{font-family:monospace;color:rgba(255,255,255,0.2);font-size:9px}
.qr{display:flex;flex-direction:column;align-items:center;gap:3px}
.qr svg{width:64px;height:64px}
.qr-l{font-size:8px;color:rgba(255,255,255,0.3)}
.actions{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:10}
.actions button{font-family:'DM Sans',sans-serif;padding:10px 32px;font-size:14px;font-weight:600;border:none;border-radius:8px;cursor:pointer}
.btn-dl{background:linear-gradient(to right,#00D4FF,#0066FF);color:#fff}
.btn-dl:hover{opacity:0.9}
@media print{.actions{display:none!important}body{background:#0F1729}}
</style>
</head>
<body>
<div class="page">
  <div class="hdr">
    <div class="logo">
      <svg viewBox="0 0 24 24" fill="none" stroke="#00D4FF" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <span class="logo-t">NIS2 Utbildning</span>
    </div>
    <div class="ttl">Kurscertifikat</div>
    <div class="sub">NIS2 Cybers\u00e4kerhetsutbildning f\u00f6r energisektorn</div>
    <div class="trk">${trackName}</div>
  </div>
  <div class="main">
    <div class="lbl">H\u00e4rmed intygas att</div>
    <div class="nm">${userName}</div>
    <div class="crs">har genomf\u00f6rt NIS2 Cybers\u00e4kerhetsutbildning \u2014 ${trackName}</div>
    <div class="crs">i enlighet med EU:s NIS2-direktiv (2022/2555)</div>
    <div class="crs">och Cybers\u00e4kerhetslagen (2025:1506)</div>
  </div>
  <div class="dts">
    <div class="dt"><div class="dv">${scorePercent}%</div><div class="dl">Provresultat</div></div>
    <div class="dt"><div class="dv">${cert.examScore}/${cert.totalQuestions}</div><div class="dl">R\u00e4tta svar</div></div>
    <div class="dt"><div class="dv">${dateStr}</div><div class="dl">Utf\u00e4rdat</div></div>
  </div>
  <div class="ftr">
    <div class="ftr-t">
      <p>&copy; 2026 Electrab AB</p>
      <p class="cid" style="margin-top:6px">Certifikat-ID: ${cert.certificateId}</p>
      <p class="cid" style="margin-top:3px">Verifiera: nis2utbildning.com/#/verify/${cert.certificateId}</p>
    </div>
    <div class="qr">
      ${qrSvg}
      <span class="qr-l">Skanna f\u00f6r att verifiera</span>
    </div>
  </div>
</div>
<div class="actions">
  <button class="btn-dl" onclick="window.print()">Skriv ut / Spara som PDF</button>
</div>
</body>
</html>`;

    // Open as a new tab via window.open — most reliable for repeated use
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    } else {
      // Popup blocked — fallback to downloading the HTML file
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NIS2-Certifikat-${userName.replace(/\s+/g, "-")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <p className="text-muted-foreground">Laddar...</p>
      </div>
    );
  }

  if (!hasCerts) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Certifikat</h1>
        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <Award className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">Inga certifikat ännu</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Slutför slutprovet med minst 70% rätt för att få ditt personliga kurscertifikat.
              Varje spår har sitt eget slutprov och certifikat.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => navigate("/exam")} data-testid="certificate-go-to-exam">
                <GraduationCap className="mr-2 h-4 w-4" />
                Gå till slutprov
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dina certifikat</h1>

      {track1Cert && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: "#00D4FF" }} />
            Spår 1: Ledning & Styrelse
          </h2>
          <CertificateCard cert={track1Cert} user={user} onPrint={handlePrint} />
        </div>
      )}

      {track2Cert && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: "#0066FF" }} />
            Spår 2: All Personal
          </h2>
          <CertificateCard cert={track2Cert} user={user} onPrint={handlePrint} />
        </div>
      )}

      {/* Show missing tracks */}
      {(!track1Cert || !track2Cert) && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Saknade certifikat</h3>
            {!track1Cert && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" style={{ color: "#00D4FF" }} />
                  <span className="text-sm">Spår 1: Ledning & Styrelse</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("/exam")}>
                  Gå till slutprov
                </Button>
              </div>
            )}
            {!track2Cert && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" style={{ color: "#0066FF" }} />
                  <span className="text-sm">Spår 2: All Personal</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("/exam")}>
                  Gå till slutprov
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Button variant="outline" onClick={() => navigate("/dashboard")}>
        Tillbaka till dashboard
      </Button>
    </div>
  );
}
