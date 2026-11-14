export function isHostedPreview() {
  return !!process.env.VERCEL && !(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
