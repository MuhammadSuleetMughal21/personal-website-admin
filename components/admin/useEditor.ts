"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SaveResult } from "@/app/actions";

/** Local draft state + save lifecycle shared by the admin editors. */
export function useEditor<T>(initial: T, save: (value: T) => Promise<SaveResult>) {
  const router = useRouter();
  const [value, setValue] = useState<T>(initial);
  const [base, setBase] = useState<T>(initial);
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const dirty = JSON.stringify(value) !== JSON.stringify(base);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onSave = useCallback(() => {
    startSaving(async () => {
      setError(null);
      const res = await save(value);
      if (res.ok) {
        setBase(value);
        setSavedAt(res.savedAt);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setSavedAt(null), 2500);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }, [save, value, router]);

  const onReset = useCallback(() => {
    setValue(base);
    setError(null);
  }, [base]);

  return { value, setValue, dirty, saving, savedAt, error, onSave, onReset };
}
