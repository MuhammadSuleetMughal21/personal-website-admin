"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  ExternalLink,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Inbox,
  Smartphone,
  Sparkles,
  User,
  Wrench,
  X,
} from "lucide-react";
import { logout } from "@/app/actions";
import { PUBLIC_SITE_URL } from "@/lib/site";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/projects", label: "Apps & Projects", icon: Smartphone },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/skills", label: "Skills", icon: Wrench },
  { href: "/services", label: "Services", icon: Sparkles },
  { href: "/process", label: "Process", icon: ListOrdered },
  { href: "/messages", label: "Messages", icon: Inbox },
];

export default function Sidebar({ unread }: { unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#09090b]/90 px-5 py-3 backdrop-blur lg:hidden">
        <span className="font-display font-semibold">Admin</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 hover:bg-white/5"
        >
          <Menu size={20} />
        </button>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/10 bg-[#0c0c0f] p-4 transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-bold"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm text-black">
              S
            </span>
            Admin
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1.5 hover:bg-white/5 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-6 flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "text-black"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <Icon size={17} className="relative" />
                <span className="relative flex-1">{label}</span>
                {href === "/messages" && unread > 0 && (
                  <span
                    className={`relative rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? "bg-black text-accent" : "bg-accent text-black"}`}
                  >
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 pt-4">
          <a
            href={PUBLIC_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
          >
            <ExternalLink size={17} /> View site
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-rose-400"
            >
              <LogOut size={17} /> Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
