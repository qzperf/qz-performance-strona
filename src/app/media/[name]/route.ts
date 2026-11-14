import { readFile } from "node:fs/promises";
import path from "node:path";
import { supabase } from "@/lib/store";
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params; if (!/^[a-f0-9-]{36}\.(jpg|jpeg|png|webp)$/.test(name)) return new Response("Not found", { status: 404 });
  const db = supabase();
  if (db) return Response.redirect(db.storage.from("photos").getPublicUrl(name).data.publicUrl);
  try { const content = await readFile(path.join(process.cwd(), "data", "photos", name)); return new Response(content, { headers: { "Content-Type": name.endsWith("png") ? "image/png" : name.endsWith("webp") ? "image/webp" : "image/jpeg", "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" } }); } catch { return new Response("Not found", { status: 404 }); }
}
