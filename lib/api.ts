import "server-only";
import { connection } from "next/server";
import { PUBLIC_SITE_URL } from "./site";
import type { Message, SiteContent } from "./types";

/** Server-side client for the public site's admin API. The key never reaches the browser. */
const SITE_URL = (process.env.SITE_URL || PUBLIC_SITE_URL).replace(/\/$/, "");

export class SiteApiError extends Error {}

export async function siteFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  await connection(); // always render at request time, never at build time
  const key = process.env.ADMIN_API_KEY;
  if (!key) throw new SiteApiError("ADMIN_API_KEY is not set in the admin's .env.local");
  let res: Response;
  try {
    res = await fetch(`${SITE_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: { ...init.headers, Authorization: `Bearer ${key}` },
    });
  } catch {
    throw new SiteApiError(`Can't reach the site at ${SITE_URL}. Is personal-website running?`);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { error?: string }).error ?? `Site API error ${res.status}`;
    throw new SiteApiError(res.status === 401 ? "The site rejected the API key. Check ADMIN_API_KEY in both projects." : msg);
  }
  return data as T;
}

export const getContent = () => siteFetch<SiteContent>("/api/admin/content");
export const getMessages = () => siteFetch<Message[]>("/api/admin/messages");

export function putSection(section: string, body: unknown) {
  return siteFetch<{ ok: true; savedAt: string }>(`/api/admin/content/${section}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function patchMessage(id: string, read: boolean) {
  return siteFetch(`/api/admin/messages/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ read }),
  });
}

export function removeMessage(id: string) {
  return siteFetch(`/api/admin/messages/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function uploadToSite(form: FormData) {
  return siteFetch<{ url: string }>("/api/admin/upload", { method: "POST", body: form });
}
