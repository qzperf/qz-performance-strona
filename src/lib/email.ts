import "server-only";
import { getSettings } from "./store";
export const emailReady = () => !!(process.env.RESEND_API_KEY && process.env.MAIL_FROM && process.env.CONTACT_EMAIL);
export async function sendMail(subject: string, html: string, replyTo?: string, recipient?: string, idempotencyKey?: string) {
  if (!emailReady()) return false;
  const settings = await getSettings();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}) },
    body: JSON.stringify({ from: process.env.MAIL_FROM, to: [recipient || process.env.CONTACT_EMAIL || settings.email], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) })
  });
  if (!response.ok) throw new Error("Nie udało się wysłać powiadomienia e-mail."); return true;
}
