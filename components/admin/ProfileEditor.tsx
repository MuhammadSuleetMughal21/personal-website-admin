"use client";

import { saveProfile } from "@/app/actions";
import { profileFields } from "@/lib/schema";
import type { Profile } from "@/lib/types";
import FieldInput from "./FieldInput";
import SaveBar from "./SaveBar";
import { useEditor } from "./useEditor";

export default function ProfileEditor({ initial }: { initial: Profile }) {
  const ed = useEditor<Profile>(initial, saveProfile);
  const groups: { title: string; keys: string[] }[] = [
    { title: "Identity", keys: ["name", "shortName", "role", "tagline", "avatar"] },
    { title: "Hero & about", keys: ["headline", "summary", "stats"] },
    { title: "Contact & links", keys: ["email", "phone", "location", "resumeUrl", "socials"] },
    { title: "Availability", keys: ["available", "availabilityText"] },
  ];

  return (
    <div className="space-y-6 pb-28">
      {groups.map((g) => (
        <section key={g.title} className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 sm:p-7">
          <h2 className="mb-5 font-display text-lg font-semibold">{g.title}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {g.keys.map((k) => {
              const field = profileFields.find((f) => f.key === k)!;
              return (
                <FieldInput
                  key={k}
                  field={field}
                  value={(ed.value as unknown as Record<string, unknown>)[k]}
                  onChange={(v) => ed.setValue((p) => ({ ...p, [k]: v }))}
                />
              );
            })}
          </div>
        </section>
      ))}
      <SaveBar {...ed} />
    </div>
  );
}
