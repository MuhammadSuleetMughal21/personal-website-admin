import Link from "next/link";
import { ArrowUpRight, Briefcase, Inbox, Smartphone, Star, Wrench } from "lucide-react";
import { getContent, getMessages } from "@/lib/api";
import { PUBLIC_SITE_URL } from "@/lib/site";
import PageHeader from "@/components/admin/PageHeader";

export default async function Dashboard() {
  const [content, messages] = await Promise.all([getContent(), getMessages()]);
  const unread = messages.filter((m) => !m.read).length;
  const missingScreens = content.projects.filter((p) => p.screens.length === 0).length;
  const missingStore = content.projects.filter((p) => !p.appStore && !p.playStore).length;

  const cards = [
    { label: "Apps", value: content.projects.length, href: "/projects", icon: Smartphone },
    { label: "Featured", value: content.projects.filter((p) => p.featured).length, href: "/projects", icon: Star },
    { label: "Roles", value: content.experience.length, href: "/experience", icon: Briefcase },
    { label: "Skills", value: content.skills.reduce((n, g) => n + g.items.length, 0), href: "/skills", icon: Wrench },
    { label: "Unread messages", value: unread, href: "/messages", icon: Inbox },
  ];

  const todos = [
    !content.profile.avatar && { text: "Upload a portrait photo", href: "/profile" },
    missingScreens > 0 && { text: `Add screenshots to ${missingScreens} app${missingScreens > 1 ? "s" : ""}`, href: "/projects" },
    missingStore > 0 && { text: `Add store links to ${missingStore} app${missingStore > 1 ? "s" : ""}`, href: "/projects" },
    !content.profile.resumeUrl && { text: "Add a résumé link", href: "/profile" },
  ].filter(Boolean) as { text: string; href: string }[];

  return (
    <div className="max-w-5xl">
      <PageHeader title={`Hi, ${content.profile.shortName}`} description="Everything you change here goes live on the site as soon as you save.">
        <a href={PUBLIC_SITE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
          Open site <ArrowUpRight size={15} />
        </a>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="group rounded-2xl border border-white/10 bg-zinc-900/40 p-5 transition hover:border-accent/40">
            <Icon size={18} className="text-zinc-500 transition group-hover:text-accent" />
            <div className="mt-4 font-display text-3xl font-semibold">{value}</div>
            <div className="text-sm text-zinc-500">{label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
          <h2 className="font-display text-lg font-semibold">To finish your portfolio</h2>
          {todos.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">All set. Nice work.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {todos.map((t) => (
                <li key={t.text}>
                  <Link href={t.href} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm hover:bg-white/[0.06]">
                    {t.text}
                    <ArrowUpRight size={15} className="text-zinc-500" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Latest messages</h2>
            <Link href="/messages" className="text-sm text-accent hover:underline">View all</Link>
          </div>
          {messages.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">No messages yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {messages.slice(0, 4).map((m) => (
                <li key={m.id} className="flex items-start gap-3 py-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-zinc-700" : "bg-accent"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="truncate text-sm text-zinc-500">{m.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
