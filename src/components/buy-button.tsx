"use client";
import { useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
export function BuyButton({ productId, demo, ready }: { productId: string; demo: boolean; ready: boolean }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [consent, setConsent] = useState(false);
  async function buy() {
    setBusy(true); setError("");
    try { const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, consent }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); window.location.assign(data.url); } catch (e) { setError(e instanceof Error ? e.message : "Płatność jest chwilowo niedostępna."); setBusy(false); }
  }
  return <div className="buy-control">{!demo && ready && <label className="consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/><span>Akceptuję <a href="/regulamin">regulamin</a>, żądam dostarczenia treści cyfrowej przed upływem terminu odstąpienia i przyjmuję do wiadomości utratę prawa odstąpienia po rozpoczęciu dostarczania.</span></label>}<button className="button buy-button" disabled={demo || !ready || busy || !consent} onClick={buy}>{busy && <LoaderCircle className="spin" size={18}/>} {demo ? "Przykład — sprzedaż wkrótce" : !ready ? "Sprzedaż w przygotowaniu" : "Kup i pobierz"}<ArrowUpRight size={19}/></button>{demo && <p>To podgląd przykładowej publikacji. Tytuł, cena i zawartość służą prezentacji biblioteki.</p>}{error && <p className="form-error" role="alert">{error}</p>}</div>;
}
