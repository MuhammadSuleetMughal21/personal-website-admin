"use client";

import { useState } from "react";
import { AnimatePresence, Reorder, motion, useDragControls } from "motion/react";
import { ChevronDown, Copy, GripVertical, Plus, Star, Trash2 } from "lucide-react";
import { saveCollection } from "@/app/actions";
import { collections, emptyItem } from "@/lib/schema";
import type { CollectionKey } from "@/lib/types";
import FieldInput from "./FieldInput";
import SaveBar from "./SaveBar";
import { useEditor } from "./useEditor";

type Item = Record<string, unknown> & { id: string; _key: string };

let keySeq = 0;
const withKey = (o: Record<string, unknown>): Item => ({ ...(o as Item), _key: `k${++keySeq}` });

/** Drag-to-reorder list of cards; each card expands into a form built from the schema. */
export default function CollectionEditor({ section, initial }: { section: CollectionKey; initial: Record<string, unknown>[] }) {
  const def = collections[section];
  const [startItems] = useState(() => initial.map(withKey));
  const ed = useEditor<Item[]>(startItems, (items) =>
    saveCollection(
      section,
      items.map((it) => {
        const rest: Record<string, unknown> = { ...it };
        delete rest._key;
        return rest;
      }),
    ),
  );
  const [openKey, setOpenKey] = useState<string | null>(null);

  const update = (key: string, field: string, v: unknown) =>
    ed.setValue((list) => list.map((it) => (it._key === key ? { ...it, [field]: v } : it)));

  const add = () => {
    const item = withKey({ ...emptyItem(def.fields), id: "" });
    ed.setValue((list) => [item, ...list]);
    setOpenKey(item._key);
  };

  const duplicate = (it: Item) => {
    const copy = withKey({ ...it, id: "", [def.titleKey]: `${it[def.titleKey] ?? ""} copy` });
    ed.setValue((list) => {
      const i = list.findIndex((x) => x._key === it._key);
      return [...list.slice(0, i + 1), copy, ...list.slice(i + 1)];
    });
    setOpenKey(copy._key);
  };

  const remove = (it: Item) => {
    if (!confirm(`Delete "${String(it[def.titleKey] || "this item")}"? You can still discard before saving.`)) return;
    ed.setValue((list) => list.filter((x) => x._key !== it._key));
  };

  return (
    <div className="pb-28">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {ed.value.length} {ed.value.length === 1 ? def.singular : `${def.singular}s`} · drag the handle to reorder
        </p>
        <button type="button" onClick={add} className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black">
          <Plus size={16} /> Add {def.singular}
        </button>
      </div>

      <Reorder.Group axis="y" values={ed.value} onReorder={ed.setValue} className="space-y-3">
        {ed.value.map((it) => (
          <Row
            key={it._key}
            item={it}
            open={openKey === it._key}
            onToggle={() => setOpenKey(openKey === it._key ? null : it._key)}
            title={String(it[def.titleKey] || `Untitled ${def.singular}`)}
            subtitle={def.subtitleKey ? String(it[def.subtitleKey] ?? "") : ""}
            color={typeof it.color === "string" ? it.color : undefined}
            featured={it.featured === true}
            onDuplicate={() => duplicate(it)}
            onRemove={() => remove(it)}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {def.fields.map((f) => (
                <FieldInput key={f.key} field={f} value={it[f.key]} onChange={(v) => update(it._key, f.key, v)} />
              ))}
            </div>
          </Row>
        ))}
      </Reorder.Group>

      {ed.value.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-zinc-500">
          Nothing here yet. Add your first {def.singular}.
        </div>
      )}
      <SaveBar {...ed} />
    </div>
  );
}

function Row({
  item,
  open,
  onToggle,
  title,
  subtitle,
  color,
  featured,
  onDuplicate,
  onRemove,
  children,
}: {
  item: Item;
  open: boolean;
  onToggle: () => void;
  title: string;
  subtitle: string;
  color?: string;
  featured: boolean;
  onDuplicate: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50"
      whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}
    >
      <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab touch-none rounded-lg p-1.5 text-zinc-600 hover:bg-white/5 hover:text-zinc-300 active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </button>
        {color && <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: color }} />}
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="min-w-0">
            <span className="flex items-center gap-2 truncate font-medium">
              {title}
              {featured && <Star size={13} className="shrink-0 fill-accent text-accent" />}
            </span>
            {subtitle && <span className="block truncate text-xs text-zinc-500">{subtitle}</span>}
          </span>
        </button>
        <button type="button" onClick={onDuplicate} aria-label="Duplicate" className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-200">
          <Copy size={15} />
        </button>
        <button type="button" onClick={onRemove} aria-label="Delete" className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-rose-400">
          <Trash2 size={15} />
        </button>
        <motion.button type="button" onClick={onToggle} aria-label={open ? "Collapse" : "Expand"} animate={{ rotate: open ? 180 : 0 }} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5">
          <ChevronDown size={18} />
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 p-4 sm:p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
