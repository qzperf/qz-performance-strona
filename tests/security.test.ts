import test from "node:test";
import assert from "node:assert/strict";
import { passwordMatches, signToken, verifyToken } from "../src/lib/tokens";
import { reviewSchema, productSchema } from "../src/lib/validation";
import { seedProducts } from "../src/lib/catalog";
process.env.SESSION_SECRET = "test-secret-is-at-least-thirty-two-characters-long";
test("moderacja: token dotyczy jednej opinii i nie daje uprawnień administratora", () => {
  const token = signToken("moderate", "review-123");
  assert.equal(verifyToken(token, "moderate"), "review-123");
  assert.equal(verifyToken(token, "admin"), null);
  const [body, signature] = token.split(".");
  const changed = JSON.parse(Buffer.from(body, "base64url").toString()); changed.id = "owner";
  const forged = `${Buffer.from(JSON.stringify(changed)).toString("base64url")}.${signature}`;
  assert.equal(verifyToken(forged, "moderate"), null);
});
test("odrzuca wygasłe i nieprawidłowe tokeny", () => {
  assert.equal(verifyToken(signToken("admin", "owner", -1), "admin"), null);
  assert.equal(verifyToken("nieprawidlowy.token", "admin"), null);
  assert.equal(passwordMatches("a", "b"), false);
  assert.equal(passwordMatches("test", "test"), true);
});
test("opinia wymaga zgody, poprawnego e-maila i pustego pola antyspamowego", () => {
  const review = { name: "Anna", email: "anna@example.com", text: "Przykładowa treść do weryfikacji walidacji.", rating: 5, consent: true, website: "" };
  assert.equal(reviewSchema.safeParse(review).success, true);
  for (const invalid of [{ consent: false }, { email: "bledny" }, { rating: 6 }, { website: "spam" }]) assert.equal(reviewSchema.safeParse({ ...review, ...invalid }).success, false);
});
test("pliki publikacji nie mogą wskazywać poza prywatny magazyn", () => {
  for (const filePath of ["../sekret", "/etc/passwd", "https://example.com/file"]) assert.equal(productSchema.safeParse({ ...seedProducts[0], filePath }).success, false);
  assert.equal(productSchema.safeParse({ ...seedProducts[0], filePath: "folder/publikacja.pdf" }).success, true);
});
