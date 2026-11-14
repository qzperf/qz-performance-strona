import { randomUUID } from "node:crypto";
import { messageSchema } from "@/lib/validation";
import { guard, readJson } from "@/lib/security";
import { addMessage } from "@/lib/store";
import { notifyMessage } from "@/lib/notifications";
export async function POST(request: Request) {
  try {
    const blocked = await guard(request, "contact"); if (blocked) return blocked;
    const parsed = messageSchema.safeParse(await readJson(request));
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const { name, email, subject, text } = parsed.data;
    const message = { id: randomUUID(), name, email, subject, text, createdAt: new Date().toISOString(), notified: false };
    await addMessage(message);
    try { message.notified = await notifyMessage(message); if (message.notified) await addMessage(message); } catch { /* Zapis zachowany w skrzynce panelu. */ }
    return Response.json({ message: message.notified ? "Dziękuję! Twoja wiadomość została zapisana i wysłana e-mailem." : "Wiadomość została zapisana w panelu autora. Wysyłka e-mail jest obecnie niedostępna.", notified: message.notified }, { status: 201 });
  } catch { return Response.json({ error: "Nie udało się zapisać wiadomości. Spróbuj ponownie za chwilę." }, { status: 500 }); }
}
