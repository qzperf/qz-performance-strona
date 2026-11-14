import "server-only";
import { createClient } from "@supabase/supabase-js";
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { defaultSettings, seedProducts } from "./catalog";
import type { Product, Review, Message, Settings } from "./types";
type LocalStore = { settings: Settings; products: Product[]; reviews: Review[]; messages: Message[]; limits: Record<string, { count: number; until: number }> };
export function supabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}
const storePath = path.join(process.cwd(), "data", "store.json");
let queue: Promise<unknown> = Promise.resolve();
async function localRead(): Promise<LocalStore> {
  if (process.env.VERCEL) throw new Error("Skonfiguruj trwałą bazę Supabase w Vercel.");
  try { return JSON.parse(await readFile(storePath, "utf8")); }
  catch (e) { if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e; return { settings: defaultSettings, products: seedProducts, reviews: [], messages: [], limits: {} }; }
}
function mutate<T>(fn: (data: LocalStore) => T): Promise<T> {
  const next = queue.then(async () => {
    const data = await localRead(); const result = fn(data);
    await mkdir(path.dirname(storePath), { recursive: true });
    const temporary = `${storePath}.${process.pid}.tmp`;
    await writeFile(temporary, JSON.stringify(data, null, 2), "utf8");
    await rename(temporary, storePath); return result;
  });
  queue = next.catch(() => undefined); return next;
}
async function all<T>(table: string, localKey: "products" | "reviews" | "messages"): Promise<T[]> {
  const db = supabase();
  if (!db) { await queue; return (await localRead())[localKey] as T[]; }
  const { data, error } = await db.from(table).select("data"); if (error) throw error;
  return data.map(row => row.data as T);
}
async function upsert(table: string, id: string, data: unknown) {
  const { error } = await supabase()!.from(table).upsert({ id, data }); if (error) throw error;
}
export async function getSettings(): Promise<Settings> {
  const db = supabase(); if (!db) { await queue; return (await localRead()).settings; }
  const { data, error } = await db.from("zbs_settings").select("data").eq("id", "main").maybeSingle();
  if (error) throw error; return { ...defaultSettings, ...(data?.data || {}) };
}
export async function saveSettings(data: Settings) { if (supabase()) return upsert("zbs_settings", "main", data); await mutate(d => { d.settings = data; }); }
export async function getProducts(includeHidden = false) {
  let products = await all<Product>("zbs_products", "products");
  if (supabase() && !products.length) products = seedProducts;
  return products.filter(p => includeHidden || p.published);
}
export async function saveProduct(product: Product) {
  if (supabase()) {
    const existing = await all<Product>("zbs_products", "products");
    if (!existing.length) { for (const p of seedProducts) await upsert("zbs_products", p.id, p); }
    return upsert("zbs_products", product.id, product);
  }
  await mutate(d => { const index = d.products.findIndex(p => p.id === product.id); if (index < 0) d.products.push(product); else d.products[index] = product; });
}
export const getReviews = () => all<Review>("zbs_reviews", "reviews");
export const getMessages = () => all<Message>("zbs_messages", "messages");
export async function addReview(review: Review) { if (supabase()) return upsert("zbs_reviews", review.id, review); await mutate(d => { const i = d.reviews.findIndex(r => r.id === review.id); if (i < 0) d.reviews.unshift(review); else d.reviews[i] = review; }); }
export async function addMessage(message: Message) { if (supabase()) return upsert("zbs_messages", message.id, message); await mutate(d => { const i = d.messages.findIndex(m => m.id === message.id); if (i < 0) d.messages.unshift(message); else d.messages[i] = message; }); }
export async function moderateReview(id: string, status: Review["status"]) {
  if (supabase()) {
    const review = (await getReviews()).find(r => r.id === id); if (!review) throw new Error("Nie znaleziono opinii.");
    return upsert("zbs_reviews", id, { ...review, status });
  }
  await mutate(d => { const review = d.reviews.find(r => r.id === id); if (!review) throw new Error("Nie znaleziono opinii."); review.status = status; });
}
export async function rateLimit(key: string, maximum = 5, minutes = 15) {
  const db = supabase();
  if (db) {
    const { data, error } = await db.rpc("zbs_rate_limit", { bucket_key: key, max_count: maximum, window_seconds: minutes * 60 });
    if (error) throw error; return data === true;
  }
  return mutate(d => {
    const now = Date.now(); for (const [k, v] of Object.entries(d.limits)) if (v.until < now) delete d.limits[k];
    const item = d.limits[key] || { count: 0, until: now + minutes * 60 * 1000 }; item.count++; d.limits[key] = item;
    return item.count <= maximum;
  });
}
