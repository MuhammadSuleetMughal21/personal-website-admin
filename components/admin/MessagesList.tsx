"use client";

import { useOptimistic, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { deleteMessage, setMessageRead } from "@/app/actions";
import type { Message } from "@/lib/types";

type Op = { type: "read"; id: string; read: boolean } | { type: "delete"; id: string };

export default function MessagesList({ messages }: { messages: Message[] }) {
  const [, start] = useTransition();
  const [list, apply] = useOptimistic(messages, (state: Message[], op: Op) =>
    op.type === "delete" ? state.filter((m) => m.id !== op.id) : state.map((m) => (m.id === op.id ? { ...m, read: op.read } : m)),
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const shown = filter === "unread" ? list.filter((m) => !m.read) : list;

  const toggleOpen = (m: Message) => {
    const next = openId === m.id ? null : m.id;
    setOpenId(next);
    if (next && !m.read) {
      start(async () => {
        apply({ type: "read", id: m.id, read: true });
        await setMessageRead(m.id, true);
      });
    }
  };

  return (
    <div>
      <div className="mb-5 inline-flex rounded-xl border border-white/10 p-1">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`relative rounded-lg px-4 py-1.5 text-sm capitalize ${filter === f ? "text-black" : "text-zinc-400"}`}
          >
            {filter === f && <motion.span layoutId="msg-filter" className="absolute inset-0 rounded-lg bg-accent" />}
            <span className="relative">{f}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-zinc-500">
          No messages {filter === "unread" ? "unread" : "yet"}. Submissions from the contact form land here.
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {shown.map((m) => (
              <motion.li
                key={m.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className={`overflow-hidden rounded-2xl border ${m.read ? "border-white/10 bg-zinc-900/30" : "border-accent/30 bg-zinc-900/70"}`}
              >
                <button type="button" onClick={() => toggleOpen(m)} className="flex w-full items-start gap-4 p-4 text-left sm:p-5">
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-accent"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className={`font-medium ${m.read ? "text-zinc-300" : ""}`}>{m.name}</span>
                      <span className="text-sm text-zinc-500">{m.email}</span>
                      {m.budget && <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">{m.budget}</span>}
                    </span>
                    <span className={`mt-1 block text-sm text-zinc-400 ${openId === m.id ? "" : "truncate"}`}>{openId === m.id ? "" : m.message}</span>
                  </span>
                  <time className="shrink-0 text-xs text-zinc-500" dateTime={m.createdAt} suppressHydrationWarning>
                    {new Date(m.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </time>
                </button>
                <AnimatePresence initial={false}>
                  {openId === m.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="border-t border-white/10 px-5 pb-5 pt-4 sm:pl-[3.4rem]">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{m.message}</p>
                        <p className="mt-3 text-xs text-zinc-500" suppressHydrationWarning>{new Date(m.createdAt).toLocaleString()}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your app project")}`} className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black">
                            <Reply size={15} /> Reply
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              start(async () => {
                                apply({ type: "read", id: m.id, read: !m.read });
                                await setMessageRead(m.id, !m.read);
                              })
                            }
                            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
                          >
                            {m.read ? <Mail size={15} /> : <MailOpen size={15} />} Mark {m.read ? "unread" : "read"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!confirm("Delete this message permanently?")) return;
                              start(async () => {
                                apply({ type: "delete", id: m.id });
                                await deleteMessage(m.id);
                              });
                            }}
                            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-rose-400"
                          >
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
