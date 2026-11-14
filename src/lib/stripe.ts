import "server-only";
import Stripe from "stripe";
export function stripe() { if (!process.env.STRIPE_SECRET_KEY) throw new Error("Płatności nie są jeszcze skonfigurowane."); return new Stripe(process.env.STRIPE_SECRET_KEY); }
