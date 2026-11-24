import type { Metadata } from "next";
import { Suspense } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { getMessages } from "@/lib/api";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Admin" },
  robots: { index: false },
};

export default function PanelLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh bg-[#09090b] text-zinc-100 lg:grid lg:grid-cols-[260px_1fr]">
      <Suspense fallback={<Sidebar unread={0} />}>
        <SidebarWithCount />
      </Suspense>
      <main className="min-w-0 px-5 py-8 sm:px-10 lg:py-12">{children}</main>
    </div>
  );
}

async function SidebarWithCount() {
  // The sidebar should still render if the site is down; the page shows the error.
  const unread = await getMessages()
    .then((list) => list.filter((m) => !m.read).length)
    .catch(() => 0);
  return <Sidebar unread={unread} />;
}
