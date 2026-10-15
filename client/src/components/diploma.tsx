import { useEffect, useState } from "react";
import QRCode from "qrcode";

export type DiplomaData = {
  certificateId: string;
  examScore: number;
  totalQuestions: number;
  track: number;
  issuedAt: string;
  expiresAt: string | null;
  isRenewal?: boolean;
};

export const trackName = (track: number) => (track === 1 ? "Ledning & Styrelse" : "All Personal");

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" }) : "—");

/** A4 landscape diploma. Rendered inside `.diploma-print-only` it becomes the only visible thing when printing. */
export function Diploma({ cert, name, companyName }: { cert: DiplomaData; name: string; companyName?: string | null }) {
  const verifyUrl = `https://nis2utbildning.com/#/verify/${cert.certificateId}`;
  const [qr, setQr] = useState<string>("");
  useEffect(() => {
    QRCode.toDataURL(verifyUrl, { margin: 0, width: 220 }).then(setQr).catch(() => setQr(""));
  }, [verifyUrl]);
  const pct = cert.totalQuestions ? Math.round((cert.examScore / cert.totalQuestions) * 100) : 0;
  const color = cert.track === 1 ? "#00A3CC" : "#0055DD";

  return (
    <div className="diploma-a4 bg-white text-slate-900 relative overflow-hidden" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="absolute inset-[10mm] border-[3px]" style={{ borderColor: color }} />
      <div className="absolute inset-[13mm] border border-slate-300" />
      <div className="relative h-full flex flex-col items-center justify-between px-[28mm] py-[24mm] text-center">
        <div>
          <div className="text-[11pt] tracking-[0.35em] uppercase text-slate-500" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
            NIS2 Utbildning · Energisektorn
          </div>
          <h1 className="mt-[6mm] text-[38pt] leading-none font-bold" style={{ color }}>Diplom</h1>
          <div className="mt-[3mm] text-[13pt] text-slate-600">Cybersäkerhetsutbildning enligt NIS2 och Cybersäkerhetslagen (2025:1506)</div>
        </div>

        <div>
          <div className="text-[12pt] text-slate-500">Härmed intygas att</div>
          <div className="mt-[3mm] text-[30pt] font-semibold border-b border-slate-300 px-[10mm] pb-[2mm]">{name}</div>
          {companyName && <div className="mt-[2mm] text-[12pt] text-slate-600">{companyName}</div>}
          <div className="mt-[5mm] text-[13pt] text-slate-700">
            har genomfört och godkänts på slutprovet för spåret <strong>{trackName(cert.track)}</strong>
            {cert.isRenewal ? " (förnyelse)" : ""} med resultatet <strong>{pct}%</strong> ({cert.examScore}/{cert.totalQuestions}).
          </div>
        </div>

        <div className="w-full flex items-end justify-between" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
          <div className="text-left text-[10pt] text-slate-600 space-y-[1mm]">
            <div><span className="text-slate-400">Utfärdat:</span> {fmt(cert.issuedAt)}</div>
            <div><span className="text-slate-400">Giltigt till:</span> {fmt(cert.expiresAt)}</div>
            <div className="text-[8pt] text-slate-400">Certifikat-ID: {cert.certificateId}</div>
          </div>
          <div className="text-center">
            {qr && <img src={qr} alt="Verifierings-QR" className="h-[26mm] w-[26mm] mx-auto" />}
            <div className="text-[7pt] text-slate-400 mt-[1mm]">Verifiera: nis2utbildning.com/#/verify</div>
          </div>
        </div>
      </div>
    </div>
  );
}
