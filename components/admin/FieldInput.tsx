"use client";

/* eslint-disable @next/next/no-img-element */
import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import type { Field } from "@/lib/schema";
import { mediaUrl } from "@/lib/site";

const input =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-zinc-600 focus:border-accent";

type Props = { field: Field; value: unknown; onChange: (v: unknown) => void };

export default function FieldInput({ field, value, onChange }: Props) {
  const id = `f-${field.key}-${useId()}`;
  const hint = "hint" in field ? field.hint : undefined;

  return (
    <div className={wide(field) ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-zinc-400">
        {field.label}
      </label>
      <Control id={id} field={field} value={value} onChange={onChange} />
      {hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

function wide(f: Field) {
  return ["textarea", "list", "images", "pairs"].includes(f.type);
}

function Control({ id, field, value, onChange }: Props & { id: string }) {
  switch (field.type) {
    case "textarea":
      return <textarea id={id} rows={4} className={`${input} resize-y`} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;

    case "list":
      return (
        <textarea
          id={id}
          rows={Math.max(3, (value as string[] | undefined)?.length ?? 0) + 1}
          className={`${input} resize-y`}
          value={((value as string[]) ?? []).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        />
      );

    case "toggle":
      return (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(!value)}
          className={`relative h-7 w-12 rounded-full transition-colors ${value ? "bg-accent" : "bg-white/15"}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "left-6 bg-black" : "left-1"}`} />
        </button>
      );

    case "color":
      return (
        <div className="flex items-center gap-2">
          <input type="color" aria-label={field.label} value={String(value || "#7c6cff")} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
          <input id={id} className={input} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </div>
      );

    case "select":
      return (
        <select id={id} className={input} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value} className="bg-zinc-900">
              {o.label}
            </option>
          ))}
        </select>
      );

    case "chips": {
      const list = (value as string[]) ?? [];
      return (
        <div id={id} className="flex flex-wrap gap-2">
          {field.options.map((o) => {
            const on = list.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => onChange(on ? list.filter((x) => x !== o) : [...list, o])}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition ${on ? "border-accent bg-accent text-black" : "border-white/10 text-zinc-400 hover:text-zinc-100"}`}
              >
                {o}
              </button>
            );
          })}
        </div>
      );
    }

    case "pairs": {
      const rows = (value as Record<string, string>[]) ?? [];
      const [a, b] = field.fields;
      const set = (i: number, k: string, v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
      return (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input aria-label={field.labels[0]} placeholder={field.labels[0]} className={`${input} w-1/3`} value={r[a] ?? ""} onChange={(e) => set(i, a, e.target.value)} />
              <input aria-label={field.labels[1]} placeholder={field.labels[1]} className={input} value={r[b] ?? ""} onChange={(e) => set(i, b, e.target.value)} />
              <button type="button" aria-label="Remove row" onClick={() => onChange(rows.filter((_, j) => j !== i))} className="rounded-xl px-3 text-zinc-500 hover:bg-white/5 hover:text-rose-400">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onChange([...rows, { [a]: "", [b]: "" }])} className="flex items-center gap-1.5 text-sm text-accent hover:underline">
            <Plus size={15} /> Add row
          </button>
        </div>
      );
    }

    case "image":
      return <ImageField multiple={false} value={value ? [String(value)] : []} onChange={(v) => onChange(v[0] ?? "")} />;

    case "images":
      return <ImageField multiple value={(value as string[]) ?? []} onChange={onChange} />;

    default:
      return (
        <input
          id={id}
          type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          placeholder={"placeholder" in field ? field.placeholder : undefined}
          className={input}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

function ImageField({ value, onChange, multiple }: { value: string[]; onChange: (v: string[]) => void; multiple: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
        break;
      }
      added.push(json.url);
    }
    onChange(multiple ? [...value, ...added] : added.slice(-1));
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((src, i) => (
          <div key={src + i} className="group relative h-28 w-20 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <img src={mediaUrl(src)} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        {(multiple || value.length === 0) && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="grid h-28 w-20 place-items-center rounded-xl border border-dashed border-white/15 text-zinc-500 transition hover:border-accent hover:text-accent"
          >
            {busy ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple={multiple} hidden onChange={(e) => upload(e.target.files)} />
      <div className="mt-2 flex gap-2">
        <input
          className={`${input} py-2`}
          placeholder="…or paste an image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && url.trim()) {
              e.preventDefault();
              onChange(multiple ? [...value, url.trim()] : [url.trim()]);
              setUrl("");
            }
          }}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
