import type { Metadata } from "next";
import { getMessages } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import MessagesList from "@/components/admin/MessagesList";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const messages = await getMessages();
  return (
    <div className="max-w-4xl">
      <PageHeader title="Messages" description="Enquiries sent through the contact form." />
      <MessagesList messages={messages} />
    </div>
  );
}
