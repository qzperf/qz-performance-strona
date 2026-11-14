import { isAdmin, guard, readJson } from "@/lib/security";
import { productSchema } from "@/lib/validation";
import { getProducts, saveProduct } from "@/lib/store";
import { categories } from "@/lib/catalog";
export async function POST(request: Request) {
  try {
    if (!await isAdmin()) return Response.json({ error: "Zaloguj się ponownie." }, { status: 401 });
    const blocked = await guard(request, "products", 60); if (blocked) return blocked;
    const parsed = productSchema.safeParse(await readJson(request)); if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const p = parsed.data;
    if (!categories.some(c => c.slug === p.category)) return Response.json({ error: "Wybierz kategorię." }, { status: 400 });
    if (!p.demo && p.published && !p.filePath) return Response.json({ error: "Przed publikacją wgraj plik do pobrania." }, { status: 400 });
    if ((await getProducts(true)).some(product => product.slug === p.slug && product.id !== p.id)) return Response.json({ error: "Ten adres publikacji jest już zajęty." }, { status: 400 });
    await saveProduct(p); return Response.json({ message: "Publikacja zapisana." });
  } catch { return Response.json({ error: "Nie udało się zapisać publikacji." }, { status: 500 }); }
}
