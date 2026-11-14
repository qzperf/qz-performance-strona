import "server-only";
import type { Review, Message } from "./types";
import { sendMail } from "./email";
import { escapeHtml, siteUrl } from "./security";
import { signToken } from "./tokens";
export async function notifyReview(review: Review) {
  const link = `${siteUrl()}/admin/moderacja?token=${encodeURIComponent(signToken("moderate", review.id, 7 * 86400))}`;
  return sendMail("Nowa opinia do zatwierdzenia — Zdrowie Bez Ściemy", `<h2>Nowa opinia (${review.rating}/5)</h2><p>${escapeHtml(review.name)} · ${escapeHtml(review.email)}</p><p style="white-space:pre-wrap">${escapeHtml(review.text)}</p><p><a href="${escapeHtml(link)}">Sprawdź i zatwierdź lub odrzuć opinię</a></p><p>Link ważny 7 dni. Opinia jest niewidoczna do momentu akceptacji.</p>`, review.email);
}
export async function notifyMessage(message: Message) {
  return sendMail(`Wiadomość ze strony: ${message.subject}`, `<h2>${escapeHtml(message.subject)}</h2><p>${escapeHtml(message.name)} · ${escapeHtml(message.email)}</p><p style="white-space:pre-wrap">${escapeHtml(message.text)}</p>`, message.email);
}
