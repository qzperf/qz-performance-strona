import "server-only";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import { verifyToken } from "./tokens";
import { rateLimit } from "./store";
export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export async function isAdmin() { return verifyToken((await cookies()).get("zbs_admin")?.value || "", "admin") === "owner"; }
export async function guard(request: Request, bucket: string, max = 5) {
  const origin = request.headers.get("origin");
  if (!origin || ![new URL(request.url).origin, siteUrl()].includes(origin)) return Response.json({ error: "Odśwież stronę i spróbuj ponownie." }, { status: 403 });
  const ip = process.env.VERCEL ? (request.headers.get("x-vercel-forwarded-for") || "unknown") : "local";
  const key = createHmac("sha256", process.env.SESSION_SECRET || "local-rate-limit").update(`${bucket}:${ip}`).digest("hex");
  if (!await rateLimit(key, max)) return Response.json({ error: "Zbyt wiele prób. Spróbuj ponownie za 15 minut." }, { status: 429, headers: { "Retry-After": "900" } });
  return null;
}
export async function readJson(request: Request) { const raw = await request.text(); if (raw.length > 40000) throw new Error("Wiadomość jest za długa."); return JSON.parse(raw); }
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
