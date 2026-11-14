import { createHmac, timingSafeEqual, createHash } from "node:crypto";
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("Ustaw SESSION_SECRET (minimum 32 znaki).");
  return value;
}
export function signToken(purpose: string, id: string, seconds = 8 * 3600) {
  const payload = Buffer.from(JSON.stringify({ purpose, id, expires: Date.now() + seconds * 1000 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
export function verifyToken(token: string, purpose: string): string | null {
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return null;
    const expected = createHmac("sha256", secret()).update(payload).digest();
    const actual = Buffer.from(signature, "base64url");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.purpose === purpose && data.expires > Date.now() && typeof data.id === "string" ? data.id : null;
  } catch { return null; }
}
export const passwordMatches = (provided: string, expected: string) => timingSafeEqual(createHash("sha256").update(provided).digest(), createHash("sha256").update(expected).digest());
