"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ui";
export function ProductCarousel({ products }: { products: Product[] }) {
  const track = useRef<HTMLDivElement>(null); const [paused, setPaused] = useState(false); const [page, setPage] = useState(0);
  const move = (direction: number) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector("a")!.getBoundingClientRect().width + 24;
    el.scrollBy({ left: card * direction, behavior: "smooth" });
  };
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => { const el = track.current; if (!el || document.hidden) return; if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) el.scrollTo({ left: 0, behavior: "smooth" }); else move(1); }, 6500);
    return () => clearInterval(id);
  }, [paused]);
  return <div className="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}><div className="product-track" ref={track} onScroll={() => { const el = track.current; if (el) setPage(Math.round(el.scrollLeft / (el.scrollWidth - el.clientWidth || 1) * 2)); }}>{products.map(p => <ProductCard key={p.id} product={p}/>)}</div><div className="carousel-bottom"><div className="carousel-dots" aria-hidden="true">{[0, 1, 2].map(i => <span key={i} className={i === page ? "current" : ""}/>)}</div><div className="carousel-actions"><button className="icon-button" aria-label={paused ? "Włącz automatyczne przewijanie publikacji" : "Wstrzymaj automatyczne przewijanie publikacji"} onClick={() => setPaused(!paused)}>{paused ? "▶" : "Ⅱ"}</button><button className="icon-button" aria-label="Poprzednie publikacje" onClick={() => { setPaused(true); move(-1); }}><ArrowLeft size={18}/></button><button className="icon-button" aria-label="Następne publikacje" onClick={() => { setPaused(true); move(1); }}><ArrowRight size={18}/></button></div></div></div>;
}
export type PublicReview = { id: string; name: string; text: string; rating: number };
export function Testimonials({ reviews }: { reviews: PublicReview[] }) {
  const [index, setIndex] = useState(0); const [paused, setPaused] = useState(false);
  useEffect(() => { if (paused || reviews.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const id = setInterval(() => { if (!document.hidden) setIndex(i => (i + 1) % reviews.length); }, 6500); return () => clearInterval(id); }, [paused, reviews.length]);
  if (!reviews.length) return <div className="reviews-empty"><Quote size={42} strokeWidth={1}/><div><h3>Twoje doświadczenie ma znaczenie.</h3><p>Korzystasz z moich materiałów lub trenujemy razem?<br/>Podziel się swoją opinią. Po zatwierdzeniu pojawi się właśnie tutaj.</p></div><a href="#dodaj-opinie" className="arrow-link">Dodaj pierwszą opinię<ArrowUpRight size={20}/></a></div>;
  const item = reviews[index % reviews.length];
  return <div className="testimonial" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}><Quote className="quote-icon" size={50}/><div className="stars" aria-label={`${item.rating} na 5 gwiazdek`}>{Array.from({ length: item.rating }, (_, i) => <Star key={i} size={16} fill="currentColor"/>)}</div><blockquote key={item.id}>{item.text}</blockquote><div className="testimonial-person"><span className="avatar">{item.name.charAt(0)}</span><div><strong>{item.name}</strong><span>Opinia opublikowana po akceptacji</span></div><div className="carousel-actions"><button className="icon-button" aria-label="Poprzednia opinia" onClick={() => { setPaused(true); setIndex((index - 1 + reviews.length) % reviews.length); }}><ArrowLeft size={18}/></button><button className="icon-button" aria-label="Następna opinia" onClick={() => { setPaused(true); setIndex((index + 1) % reviews.length); }}><ArrowRight size={18}/></button></div></div></div>;
}
