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

    // Generate a real QR code SVG string (dark blue on transparent)
    let qrSvg = "";
    try {
      qrSvg = await QRCode.toString(verifyUrl, {
        type: "svg",
        width: 52,
        margin: 1,
        color: { dark: "#0A1628", light: "#00000000" },
      });
    } catch {
      qrSvg = `<svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"><rect width="52" height="52" rx="4" fill="#f5f5f0"/><text x="26" y="26" text-anchor="middle" dominant-baseline="middle" fill="#0A1628" font-size="7" font-family="monospace">QR</text></svg>`;
    }

    // Course content list based on track
    const courseTopics = cert.track === 1
      ? "NIS2-direktivet \u00b7 Cybers\u00e4kerhetslagen \u00b7 Riskhantering \u00b7 Incidenthantering \u00b7 Leverant\u00f6rss\u00e4kerhet \u00b7 Kryptografi \u00b7 \u00c5tkomstkontroll \u00b7 Kontinuitetshantering \u00b7 Ledningens ansvar \u00b7 Styrelsens roll \u00b7 Sanktioner"
      : "NIS2-direktivet \u00b7 Cybers\u00e4kerhetslagen \u00b7 Riskhantering \u00b7 Incidenthantering \u00b7 Leverant\u00f6rss\u00e4kerhet \u00b7 Kryptografi \u00b7 \u00c5tkomstkontroll \u00b7 Kontinuitetshantering \u00b7 S\u00e4kerhetsmedvetenhet \u00b7 N\u00e4tverkss\u00e4kerhet";

    // A4 certificate \u2014 white bg, navy header chevron, gold accents
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>NIS2 Certifikat \u2014 ${userName} \u2014 ${trackName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;height:297mm;overflow:hidden}
body{font-family:'DM Sans',sans-serif;background:#e8e8e4;display:flex;flex-direction:column;align-items:center;justify-content:center}
.page{width:210mm;height:297mm;background:#fff;color:#0A1628;position:relative;display:flex;flex-direction:column;overflow:hidden}
.page::before{content:'';position:absolute;top:7mm;left:7mm;right:7mm;bottom:7mm;border:2.5px solid #C9A84C;pointer-events:none;z-index:2}
.page::after{content:'';position:absolute;top:10mm;left:10mm;right:10mm;bottom:10mm;border:1px solid #E8D5A0;pointer-events:none;z-index:2}
.header{position:relative;background:#0A1628;text-align:center;padding:16mm 20mm 20mm;clip-path:polygon(0 0,100% 0,100% 80%,50% 100%,0 80%);z-index:1}
.header::before{content:'';position:absolute;bottom:0;left:0;right:0;height:100%;clip-path:polygon(0 78%,50% 98%,100% 78%,100% 80%,50% 100%,0 80%);background:linear-gradient(135deg,#C9A84C,#E8D5A0,#C9A84C);z-index:0}
.header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:100%;clip-path:polygon(0 75%,50% 95%,100% 75%,100% 78%,50% 98%,0 78%);background:#0A1628;z-index:0}
.header-content{position:relative;z-index:1}
.certified-by{font-size:9px;text-transform:uppercase;letter-spacing:4px;color:rgba(255,255,255,0.5);margin-bottom:8px}
.cert-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#C9A84C;letter-spacing:1px}
.cert-subtitle{font-size:11px;color:rgba(255,255,255,0.6);margin-top:6px}
.medallion{width:90px;height:90px;margin:-32px auto 0;position:relative;z-index:3}
.medallion svg{width:100%;height:100%;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.1))}
.body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 28mm 0;text-align:center}
.ttl{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#0A1628;margin-bottom:2px}
.gold-line{width:50px;height:2px;background:linear-gradient(to right,transparent,#C9A84C,transparent);margin:6px auto 14px}
.lbl{font-size:9px;text-transform:uppercase;letter-spacing:3px;color:#999;margin-bottom:6px}
.nm{font-family:'Playfair Display',serif;font-size:30px;font-weight:600;color:#0A1628;margin-bottom:4px;line-height:1.2}
.nm-line{width:200px;height:1px;background:#ddd;margin:0 auto 16px}
.desc{font-size:11px;color:#666;line-height:1.8}
.desc-block{margin-bottom:12px}
.trk-badge{display:inline-block;padding:4px 18px;border:1.5px solid ${trackColor};color:${trackColor};border-radius:20px;font-size:10px;font-weight:600;margin-top:8px;margin-bottom:4px}
.stats{display:flex;justify-content:center;gap:32px;margin-top:16px;padding-top:14px;border-top:1px solid #eee}
.stat{text-align:center}
.stat-v{font-size:15px;font-weight:700;color:#0A1628}
.stat-l{font-size:7px;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin-top:2px}
.course-content{margin-top:16px;padding-top:12px;border-top:1px solid #eee;max-width:440px}
.course-content-title{font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:6px}
.course-content-list{font-size:9px;color:#888;line-height:1.6}
.ftr{padding:8mm 16mm;display:flex;align-items:flex-end;justify-content:space-between;position:relative;z-index:1}
.ftr-left{text-align:left}
.ftr-date-label{font-size:8px;color:#aaa;text-transform:uppercase;letter-spacing:1px}
.ftr-date{font-size:11px;font-weight:600;color:#0A1628;margin-top:2px}
.ftr-id{font-family:monospace;font-size:7px;color:#bbb;margin-top:6px}
.ftr-verify{font-size:7px;color:#bbb;margin-top:2px}
.ftr-center{text-align:center}
.ftr-sig-line{width:40mm;height:1px;background:#C9A84C;margin:0 auto 4px}
.ftr-sig-name{font-family:'Playfair Display',serif;font-size:11px;font-style:italic;color:#0A1628}
.ftr-sig-role{font-size:8px;color:#888;margin-top:2px}
.ftr-right{display:flex;flex-direction:column;align-items:center;gap:2px}
.ftr-right svg{width:52px;height:52px}
.ftr-qr-l{font-size:6px;color:#bbb}
.actions{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:10}
.actions button{font-family:'DM Sans',sans-serif;padding:10px 32px;font-size:14px;font-weight:600;border:none;border-radius:8px;cursor:pointer;background:#0A1628;color:#fff}
.actions button:hover{opacity:0.9}
@media print{.actions{display:none!important}body{background:#fff}}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-content">
      <div class="certified-by">Certifierad av Electrab AB</div>
      <div class="cert-title">NIS2 CYBERS\u00c4KERHETSUTBILDNING</div>
      <div class="cert-subtitle">f\u00f6r energisektorn</div>
    </div>
  </div>
  <div class="medallion">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#C9A84C" stroke-width="1"/>
      <g opacity="0.6">
        <ellipse cx="14" cy="50" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(-20 14 50)"/>
        <ellipse cx="16" cy="38" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(-40 16 38)"/>
        <ellipse cx="22" cy="28" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(-60 22 28)"/>
        <ellipse cx="32" cy="20" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(-75 32 20)"/>
        <ellipse cx="42" cy="14" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(-85 42 14)"/>
      </g>
      <g opacity="0.6">
        <ellipse cx="86" cy="50" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(20 86 50)"/>
        <ellipse cx="84" cy="38" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(40 84 38)"/>
        <ellipse cx="78" cy="28" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(60 78 28)"/>
        <ellipse cx="68" cy="20" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(75 68 20)"/>
        <ellipse cx="58" cy="14" rx="4" ry="8" fill="none" stroke="#C9A84C" stroke-width="0.8" transform="rotate(85 58 14)"/>
      </g>
      <circle cx="50" cy="50" r="34" fill="#0A1628"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="#C9A84C" stroke-width="0.5"/>
      <path d="M50 30l12 4.5v9c0 8.5-5.1 16.5-12 19.5-6.9-3-12-11-12-19.5v-9L50 30z" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
      <path d="M46 44l3 3 6-6" fill="none" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
  <div class="body">
    <div class="ttl">Kurscertifikat</div>
    <div class="gold-line"></div>
    <div class="lbl">H\u00e4rmed intygas att</div>
    <div class="nm">${userName}</div>
    <div class="nm-line"></div>
    <div class="desc-block">
      <div class="desc">har genomf\u00f6rt NIS2 Cybers\u00e4kerhetsutbildning</div>
      <div class="desc">i enlighet med EU:s NIS2-direktiv (2022/2555)</div>
      <div class="desc">och Cybers\u00e4kerhetslagen (2025:1506)</div>
    </div>
    <div class="trk-badge">${trackName}</div>
    <div class="stats">
      <div class="stat"><div class="stat-v">${scorePercent}%</div><div class="stat-l">Provresultat</div></div>
      <div class="stat"><div class="stat-v">${cert.examScore}/${cert.totalQuestions}</div><div class="stat-l">R\u00e4tta svar</div></div>
      <div class="stat"><div class="stat-v">${dateStr}</div><div class="stat-l">Utf\u00e4rdat</div></div>
    </div>
    <div class="course-content">
      <div class="course-content-title">Utbildningsinneh\u00e5ll</div>
      <div class="course-content-list">${courseTopics}</div>
    </div>
  </div>
  <div class="ftr">
    <div class="ftr-left">
      <div class="ftr-date-label">Datum</div>
      <div class="ftr-date">${dateStr}</div>
      <div class="ftr-id">Certifikat-ID: ${cert.certificateId}</div>
      <div class="ftr-verify">Verifiera: nis2utbildning.com/#/verify/${cert.certificateId}</div>
    </div>
    <div class="ftr-center">
      <div class="ftr-sig-line"></div>
      <div class="ftr-sig-name">Electrab AB</div>
      <div class="ftr-sig-role">Utbildningsansvarig</div>
    </div>
    <div class="ftr-right">
      ${qrSvg}
      <span class="ftr-qr-l">Skanna f\u00f6r att verifiera</span>
    </div>
  </div>
</div>
<div class="actions">
  <button onclick="window.print()">Skriv ut / Spara som PDF</button>
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
