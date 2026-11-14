import { z } from "zod";
export const reviewSchema = z.object({
  name: z.string().trim().min(2, "Podaj imię (minimum 2 znaki).").max(70),
  email: z.email("Podaj poprawny adres e-mail.").max(200),
  text: z.string().trim().min(15, "Napisz co najmniej 15 znaków.").max(1500),
  rating: z.number().int().min(1).max(5),
  consent: z.literal(true, { error: "Zaznacz zgodę na publikację opinii." }),
  website: z.string().max(0).optional()
});
export const messageSchema = z.object({
  name: z.string().trim().min(2, "Podaj imię.").max(70),
  email: z.email("Podaj poprawny adres e-mail.").max(200),
  subject: z.string().trim().min(2).max(120),
  text: z.string().trim().min(15, "Wiadomość powinna mieć minimum 15 znaków.").max(5000),
  consent: z.literal(true, { error: "Potwierdź zapoznanie się z informacją o prywatności." }),
  website: z.string().max(0).optional()
});
const localImage = z.string().max(1000).refine(value => !value || (value.startsWith("/media/") && !value.includes("..")), "Wgraj zdjęcie przez panel.");
export const settingsSchema = z.object({
  name: z.string().trim().min(2).max(70),
  email: z.union([z.email(), z.literal("")]), phone: z.string().max(40),
  bio: z.string().min(10).max(1500), about: z.string().max(6000),
  portrait: localImage, sportsPhotos: z.record(z.string().max(50), localImage),
  offer: z.string().max(3000), offerPrice: z.string().max(100),
  privacy: z.string().max(12000), terms: z.string().max(20000)
});
export const productSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{2,100}$/), slug: z.string().regex(/^[a-z0-9-]{2,100}$/),
  title: z.string().trim().min(3).max(100), subtitle: z.string().max(150),
  description: z.string().min(15).max(6000), category: z.string().max(80), topic: z.string().max(50).optional(),
  format: z.enum(["ebook", "audio", "bundle"]), color: z.enum(["orange", "green", "cream", "blue"]),
  price: z.number().int().min(100).max(1000000), pages: z.number().int().min(0).max(5000),
  duration: z.string().max(80), featured: z.boolean(), published: z.boolean(), demo: z.boolean(),
  filePath: z.string().max(300).regex(/^(?:[a-zA-Z0-9_./-]*)$/).refine(p => !p.includes("..") && !p.startsWith("/")),
  contents: z.array(z.string().min(2).max(160)).min(1).max(30)
});
