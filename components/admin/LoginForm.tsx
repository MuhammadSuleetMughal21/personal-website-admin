"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { login, type LoginState } from "@/app/actions";
import { PUBLIC_SITE_URL } from "@/lib/site";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <motion.form
      action={action}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-xl"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-black">
        <Lock size={20} />
      </span>
      <h1 className="mt-6 font-display text-2xl font-semibold">Admin panel</h1>
      <p className="mt-1 text-sm text-zinc-400">Sign in to edit your portfolio.</p>
      <label className="mt-8 block text-xs font-medium uppercase tracking-wider text-zinc-400" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none transition focus:border-accent"
      />
      {state.error && (
        <motion.p initial={{ x: -8 }} animate={{ x: [8, -6, 4, 0] }} className="mt-3 text-sm text-rose-400">
          {state.error}
        </motion.p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-xl bg-accent py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <a href={PUBLIC_SITE_URL} className="mt-5 block text-center text-xs text-zinc-500 hover:text-zinc-300">
        ← Back to site
      </a>
    </motion.form>
  );
}
