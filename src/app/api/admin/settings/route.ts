import { isAdmin, guard, readJson } from "@/lib/security";
import { settingsSchema } from "@/lib/validation";
import { saveSettings } from "@/lib/store";
export async function PUT(request: Request) {
  try {
    if (!await isAdmin()) return Response.json({ error: "Zaloguj się ponownie." }, { status: 401 });
    const blocked = await guard(request, "settings", 60); if (blocked) return blocked;
    const parsed = settingsSchema.safeParse(await readJson(request)); if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    await saveSettings(parsed.data); return Response.json({ message: "Ustawienia zapisane. Zmiany są już widoczne na stronie." });
  } catch { return Response.json({ error: "Nie udało się zapisać ustawień." }, { status: 500 }); }
}
