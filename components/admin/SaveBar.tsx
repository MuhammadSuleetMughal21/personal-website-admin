"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";

/** Floating bar that appears when there are unsaved changes. Ctrl/⌘+S saves. */
export default function SaveBar({
  dirty,
  saving,
  savedAt,
  error,
  onSave,
  onReset,
}: {
  dirty: boolean;
  saving: boolean;
  savedAt: string | null;
  error: string | null;
  onSave: () => void;
  onReset: () => void;
}) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) onSave();
      }
    };
    const leave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", key);
    window.addEventListener("beforeunload", leave);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("beforeunload", leave);
    };
  }, [dirty, saving, onSave]);

  return (
    <AnimatePresence>
      {(dirty || error || savedAt) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-900/95 px-5 py-3 shadow-2xl backdrop-blur lg:left-[276px]"
        >
          <span className="text-sm">
            {error ? (
              <span className="text-rose-400">{error}</span>
            ) : dirty ? (
              "You have unsaved changes"
            ) : (
              <span className="flex items-center gap-2 text-emerald-400">
                <Check size={16} /> Saved, live on the site
              </span>
            )}
          </span>
          {dirty && (
            <div className="flex gap-2">
              <button type="button" onClick={onReset} disabled={saving} className="rounded-xl px-4 py-2 text-sm text-zinc-400 hover:bg-white/5">
                Discard
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                Save
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
