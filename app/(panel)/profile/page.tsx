import type { Metadata } from "next";
import { getContent } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import ProfileEditor from "@/components/admin/ProfileEditor";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { profile } = await getContent();
  return (
    <div className="max-w-4xl">
      <PageHeader title="Profile" description="Your name, headline, about text, contact details and links." />
      <ProfileEditor initial={profile} />
    </div>
  );
}
