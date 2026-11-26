"use client";

import { useActionState, useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { login, type LoginState } from "@/app/actions";
import { PUBLIC_SITE_URL } from "@/lib/site";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="relative mt-2">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          autoFocus
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-4 pr-12 outline-none transition focus:border-accent"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          aria-controls="password"
          className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-zinc-400 transition hover:text-zinc-100 focus-visible:text-accent focus-visible:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
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
