"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { patchMessage, putSection, removeMessage } from "@/lib/api";
import { COLLECTION_KEYS } from "@/lib/schema";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  checkPassword,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session";
import type { CollectionKey } from "@/lib/types";

async function requireAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token, Date.now())) {
    throw new Error("Your session expired. Sign in again.");
  }
}

// Slow down password guessing: a short in-memory lockout after repeated failures.
const failures = { count: 0, until: 0 };

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const now = Date.now();
  if (now < failures.until) {
    return { error: "Too many attempts. Try again in a minute." };
  }
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    failures.count += 1;
    if (failures.count >= 5) {
      failures.until = now + 60_000;
      failures.count = 0;
    }
    await new Promise((r) => setTimeout(r, 400));
    return { error: "Incorrect password." };
  }
  failures.count = 0;
  (await cookies()).set(SESSION_COOKIE, createSessionToken(now), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  redirect("/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

export type SaveResult = { ok: true; savedAt: string } | { ok: false; error: string };

async function save(section: string, input: unknown): Promise<SaveResult> {
  try {
    await requireAdmin();
    const res = await putSection(section, input);
    revalidatePath("/", "layout");
    return { ok: true, savedAt: res.savedAt };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function saveProfile(input: unknown): Promise<SaveResult> {
  return save("profile", input);
}

export async function saveCollection(key: CollectionKey, input: unknown): Promise<SaveResult> {
  if (!COLLECTION_KEYS.includes(key)) return { ok: false, error: "Unknown section" };
  return save(key, input);
}

export async function setMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await patchMessage(id, read);
  revalidatePath("/", "layout");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await removeMessage(id);
  revalidatePath("/", "layout");
}
