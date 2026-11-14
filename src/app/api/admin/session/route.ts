import { NextResponse } from "next/server";
import { guard, readJson } from "@/lib/security";
import { passwordMatches, signToken } from "@/lib/tokens";
export async function POST(request: Request) {
  try {
    const blocked = await guard(request, "login", 5); if (blocked) return blocked;
    const { password } = await readJson(request);
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 16) return Response.json({ error: "Panel wymaga ustawienia hasła administratora w środowisku serwera." }, { status: 503 });
    if (typeof password !== "string" || password.length > 256 || !passwordMatches(password, process.env.ADMIN_PASSWORD)) return Response.json({ error: "Nieprawidłowe hasło." }, { status: 401 });
    const response = NextResponse.json({ success: true });
    response.cookies.set("zbs_admin", signToken("admin", "owner"), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 8 * 3600 }); return response;
  } catch { return Response.json({ error: "Nie udało się zalogować." }, { status: 500 }); }
}
export async function DELETE(request: Request) { const blocked = await guard(request, "logout", 30); if (blocked) return blocked; const response = NextResponse.json({ success: true }); response.cookies.set("zbs_admin", "", { maxAge: 0, path: "/" }); return response; }
