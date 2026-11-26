import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Tiny signed-cookie session for a single admin user.
 * Token format: `<expiresAtMs>.<hmacSha256(expiresAtMs)>`.
 * No server-side state; rotating SESSION_SECRET logs everyone out.
 */
export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/** Names any missing server settings that make sign-in impossible, or null when ready. */
export function authConfigError(): string | null {
  const missing: string[] = [];
  if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) missing.push("SESSION_SECRET (16+ characters)");
  return missing.length ? `Sign-in isn't set up on the server. Missing: ${missing.join(", ")}.` : null;
}

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("SESSION_SECRET is missing or too short (set it in .env.local)");
  }
  return s;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function createSessionToken(now: number) {
  const exp = String(now + SESSION_TTL_MS);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token: string | undefined, now: number) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (!safeEqual(sig, sign(exp))) return false;
  return Number(exp) > now;
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare HMACs so the comparison is constant-time regardless of length.
  return safeEqual(sign(`pw:${input}`), sign(`pw:${expected}`));
}
