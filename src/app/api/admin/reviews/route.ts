import { isAdmin, guard, readJson } from "@/lib/security";
import { verifyToken } from "@/lib/tokens";
import { moderateReview } from "@/lib/store";
export async function PATCH(request: Request) {
  try {
    const { id, status, token } = await readJson(request);
    if (!await isAdmin() && !(typeof token === "string" && verifyToken(token, "moderate") === id)) return Response.json({ error: "Zaloguj się lub otwórz aktualny link z e-maila." }, { status: 401 });
    const blocked = await guard(request, "moderation", 100); if (blocked) return blocked;
    if (typeof id !== "string" || !["approved", "rejected", "pending"].includes(status)) return Response.json({ error: "Nieprawidłowa decyzja." }, { status: 400 });
    await moderateReview(id, status); return Response.json({ message: status === "approved" ? "Opinia zatwierdzona i widoczna na stronie." : status === "rejected" ? "Opinia odrzucona. Nie będzie widoczna na stronie." : "Opinia ukryta i przeniesiona do oczekujących." });
  } catch { return Response.json({ error: "Nie udało się zmienić statusu opinii." }, { status: 500 }); }
}
