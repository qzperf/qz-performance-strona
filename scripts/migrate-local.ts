import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Settings, Product, Review, Message } from "../src/lib/types";
const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Ustaw SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY w .env.local.");
const db = createClient(url, key, { auth: { persistSession: false } });
const folder = path.join(process.cwd(), "data");
const data = JSON.parse(await readFile(path.join(folder, "store.json"), "utf8")) as { settings: Settings; products: Product[]; reviews: Review[]; messages: Message[] };
for (const [localFolder, bucket] of [["photos", "photos"], ["uploads", "publications"]]) {
  let files: string[] = []; try { files = await readdir(path.join(folder, localFolder)); } catch (e) { if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e; }
  for (const name of files) {
    if (!/^[a-f0-9-]{36}\.[a-z0-9]+$/.test(name)) continue;
    const bytes = await readFile(path.join(folder, localFolder, name));
    const type = ({ pdf: "application/pdf", epub: "application/epub+zip", mp3: "audio/mpeg", m4a: "audio/mp4", zip: "application/zip", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" } as Record<string, string>)[name.split(".").pop()!] || "application/octet-stream";
    const { error } = await db.storage.from(bucket).upload(name, bytes, { contentType: type, upsert: true }); if (error) throw error;
  }
}
const batches: [string, { id: string; data: object }[]][] = [
  ["zbs_settings", [{ id: "main", data: data.settings }]],
  ["zbs_products", data.products.map(p => ({ id: p.id, data: { ...p, filePath: p.filePath.replace(/^uploads\//, "") } }))],
  ["zbs_reviews", data.reviews.map(r => ({ id: r.id, data: r }))],
  ["zbs_messages", data.messages.map(m => ({ id: m.id, data: m }))]
];
for (const [table, entries] of batches) {
  if (!entries.length) continue;
  const { error } = await db.from(table).upsert(entries); if (error) throw error;
  console.log(`${table}: ${entries.length} rekordów przeniesiono.`);
}
console.log("Migracja zakończona. Lokalna kopia pozostała w data/.");
