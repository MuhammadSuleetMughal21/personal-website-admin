import { getContent } from "@/lib/api";
import { collections } from "@/lib/schema";
import type { CollectionKey } from "@/lib/types";
import PageHeader from "./PageHeader";
import CollectionEditor from "./CollectionEditor";

export default async function SectionPage({ section }: { section: CollectionKey }) {
  const def = collections[section];
  const content = await getContent();
  return (
    <div className="max-w-4xl">
      <PageHeader title={def.label} description={def.description} />
      <CollectionEditor section={section} initial={content[section] as unknown as Record<string, unknown>[]} />
    </div>
  );
}
