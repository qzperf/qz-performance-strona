export type Category = { slug: string; title: string; short: string; description: string; icon: string; };
export type Product = {
  id: string; slug: string; title: string; subtitle: string; description: string;
  category: string; topic?: string; format: "ebook" | "audio" | "bundle";
  price: number; color: "orange" | "green" | "cream" | "blue";
  pages: number; duration: string; featured: boolean; published: boolean;
  demo: boolean; filePath: string; contents: string[];
};
export type Review = { id: string; name: string; email: string; text: string; rating: number; createdAt: string; status: "pending" | "approved" | "rejected"; notified?: boolean; };
export type Message = { id: string; name: string; email: string; subject: string; text: string; createdAt: string; notified?: boolean; };
export type Settings = { name: string; email: string; phone: string; bio: string; about: string; portrait: string; sportsPhotos: Record<string, string>; offer: string; offerPrice: string; privacy: string; terms: string; };
