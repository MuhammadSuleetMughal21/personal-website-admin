import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#09090b] px-5">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-2/20 blur-[120px]" />
      <LoginForm />
    </main>
  );
}
