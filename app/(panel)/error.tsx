"use client";

import { RefreshCw, ServerCrash } from "lucide-react";

/** Shown when the site API is unreachable or rejects the request. */
export default function PanelError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
      <ServerCrash className="mx-auto text-rose-400" size={32} />
      <h1 className="mt-4 font-display text-xl font-semibold">Couldn&apos;t load data from the site</h1>
      <p className="mt-2 text-sm text-zinc-400">{error.message}</p>
      <p className="mt-4 text-xs text-zinc-500">
        Start the site with <code className="rounded bg-white/5 px-1.5 py-0.5">npm run dev</code> in{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5">personal-website/</code>, then retry.
      </p>
      <button type="button" onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black">
        <RefreshCw size={15} /> Retry
      </button>
    </div>
  );
}
