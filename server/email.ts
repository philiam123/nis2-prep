import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'NIS2 Utbildning <noreply@nis2utbildning.com>';

export async function sendWelcomeEmail(to: string, name: string) {
  if (!resend) { console.log('Email skipped (no RESEND_API_KEY):', to); return; }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Välkommen till NIS2 Utbildning',
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#0F1729">Välkommen, ${name}!</h1>
        <p>Tack för att du registrerade dig på NIS2 Utbildning — cybersäkerhetsutbildning för energisektorn.</p>
        <p>Logga in och kom igång med din utbildning:</p>
        <p><a href="https://nis2utbildning.com/#/login" style="display:inline-block;padding:12px 24px;background:linear-gradient(to right,#06b6d4,#3b82f6);color:white;text-decoration:none;border-radius:8px;font-weight:600">Logga in</a></p>
        <p style="color:#666;font-size:14px;margin-top:24px">Med vänliga hälsningar,<br>NIS2 Utbildning av Electrab AB</p>
      </div>`
    });
  } catch (err) { console.error('Welcome email failed:', err); }
}

export async function sendPaymentConfirmation(to: string, name: string) {
  if (!resend) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Betalningsbekräftelse — NIS2 Utbildning',
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#0F1729">Tack för din betalning!</h1>
        <p>Hej ${name},</p>
        <p>Vi bekräftar din betalning på <strong>1 490 kr</strong> för NIS2 Cybersäkerhetsutbildning.</p>
        <p>Du har nu obegränsad tillgång till alla 13 utbildningsmoduler, quiz och slutprov.</p>
        <p><a href="https://nis2utbildning.com/#/dashboard" style="display:inline-block;padding:12px 24px;background:linear-gradient(to right,#06b6d4,#3b82f6);color:white;text-decoration:none;border-radius:8px;font-weight:600">Gå till dashboard</a></p>
        <p style="color:#666;font-size:14px;margin-top:24px">Med vänliga hälsningar,<br>NIS2 Utbildning av Electrab AB</p>
      </div>`
    });
  } catch (err) { console.error('Payment email failed:', err); }
}

export async function sendCertificateEmail(to: string, name: string, certificateId: string, score: number, total: number, trackName?: string) {
  if (!resend) return;
  const pct = Math.round((score / total) * 100);
  const trackLabel = trackName ? ` — ${trackName}` : '';
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Grattis! Ditt NIS2-certifikat${trackLabel}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#0F1729">Grattis, ${name}!</h1>
        <p>Du har klarat slutprovet${trackLabel} med <strong>${pct}%</strong> (${score}/${total} rätt) och erhållit ditt NIS2-certifikat.</p>
        ${trackName ? `<p><strong>Spår:</strong> ${trackName}</p>` : ''}
        <p><strong>Certifikat-ID:</strong> <code>${certificateId}</code></p>
        <p>Verifiera certifikatet här:</p>
        <p><a href="https://nis2utbildning.com/#/verify/${certificateId}" style="display:inline-block;padding:12px 24px;background:linear-gradient(to right,#06b6d4,#3b82f6);color:white;text-decoration:none;border-radius:8px;font-weight:600">Verifiera certifikat</a></p>
        <p style="color:#666;font-size:14px;margin-top:24px">Med vänliga hälsningar,<br>NIS2 Utbildning av Electrab AB</p>
      </div>`
    });
  } catch (err) { console.error('Certificate email failed:', err); }
}
