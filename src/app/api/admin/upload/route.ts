import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { guard, isAdmin, readJson } from "@/lib/security";
import { supabase } from "@/lib/store";
import { signToken, verifyToken } from "@/lib/tokens";
const extensions: Record<string, string[]> = { photo: ["jpg", "jpeg", "png", "webp"], publication: ["pdf", "epub", "mp3", "m4a", "zip"] };
const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", pdf: "application/pdf", epub: "application/epub+zip", mp3: "audio/mpeg", m4a: "audio/mp4", zip: "application/zip" };
export async function POST(request: Request) {
  try {
    if (!await isAdmin()) return Response.json({ error: "Zaloguj się." }, { status: 401 });
    const blocked = await guard(request, "upload-init", 100); if (blocked) return blocked;
    const { name, kind, size } = await readJson(request); const ext = typeof name === "string" ? name.split(".").pop()!.toLowerCase() : "";
    if (!extensions[kind]?.includes(ext) || typeof size !== "number" || size <= 0 || size > (kind === "photo" ? 10 : 500) * 1024 * 1024) return Response.json({ error: "Wybierz zdjęcie JPG/PNG/WebP do 10 MB lub publikację PDF/EPUB/MP3/M4A/ZIP do 500 MB." }, { status: 400 });
    const filename = `${randomUUID()}.${ext}`; const db = supabase();
    if (db) {
      const { data, error } = await db.storage.from(kind === "photo" ? "photos" : "publications").createSignedUploadUrl(filename); if (error) throw error;
      return Response.json({ uploadUrl: data.signedUrl, storagePath: kind === "photo" ? `/media/${filename}` : filename, contentType: types[ext] });
    }
    if (process.env.VERCEL) throw new Error("Skonfiguruj Supabase Storage.");
    return Response.json({ uploadUrl: `/api/admin/upload?token=${encodeURIComponent(signToken("upload", `${kind}:${filename}:${size}`, 600))}`, storagePath: kind === "photo" ? `/media/${filename}` : `uploads/${filename}`, contentType: types[ext] });
  } catch { return Response.json({ error: "Nie udało się przygotować przesyłania pliku." }, { status: 500 }); }
}
export async function PUT(request: Request) {
  try {
    if (process.env.VERCEL || supabase() || !await isAdmin()) return Response.json({ error: "Brak dostępu." }, { status: 401 });
    const blocked = await guard(request, "upload-file", 100); if (blocked) return blocked;
    const id = verifyToken(new URL(request.url).searchParams.get("token") || "", "upload"); if (!id) return Response.json({ error: "Link przesyłania wygasł." }, { status: 403 });
    const [kind, filename, size] = id.split(":"); const bytes = Buffer.from(await request.arrayBuffer());
    if (bytes.byteLength !== Number(size)) return Response.json({ error: "Nieprawidłowy rozmiar pliku." }, { status: 400 });
    const folder = path.join(process.cwd(), "data", kind === "photo" ? "photos" : "uploads"); await mkdir(folder, { recursive: true }); await writeFile(path.join(folder, filename), bytes);
    return Response.json({ success: true });
  } catch { return Response.json({ error: "Przesyłanie nie powiodło się." }, { status: 500 }); }
}
