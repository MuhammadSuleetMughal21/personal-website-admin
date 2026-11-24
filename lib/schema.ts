// Copy of personal-website/lib/schema.ts — keep in sync (the site re-sanitises everything it receives).
import type { CollectionKey } from "./types";

/**
 * Field definitions drive both the admin forms and server-side sanitising,
 * so adding a field here makes it editable and persisted in one place.
 */
export type Field =
  | { key: string; label: string; type: "text" | "textarea" | "color" | "url" | "email"; placeholder?: string; hint?: string }
  | { key: string; label: string; type: "toggle"; hint?: string }
  | { key: string; label: string; type: "list"; hint?: string }
  | { key: string; label: string; type: "chips"; options: string[] }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[] }
  | { key: string; label: string; type: "images"; hint?: string }
  | { key: string; label: string; type: "image"; hint?: string }
  | { key: string; label: string; type: "pairs"; fields: [string, string]; labels: [string, string] };

export const SERVICE_ICONS = [
  { value: "smartphone", label: "Smartphone" },
  { value: "server", label: "Server" },
  { value: "sparkles", label: "Sparkles (AI)" },
  { value: "rocket", label: "Rocket" },
  { value: "palette", label: "Palette (design)" },
  { value: "shield", label: "Shield (security)" },
  { value: "zap", label: "Zap (performance)" },
  { value: "layers", label: "Layers (architecture)" },
];

export const profileFields: Field[] = [
  { key: "name", label: "Full name", type: "text" },
  { key: "shortName", label: "Short name / logo", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "headline", label: "Hero headline", type: "textarea", hint: "Large animated text in the hero." },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "summary", label: "About summary", type: "textarea" },
  { key: "location", label: "Location", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "available", label: "Open to work", type: "toggle", hint: "Shows the green availability badge." },
  { key: "availabilityText", label: "Availability text", type: "text" },
  { key: "avatar", label: "Portrait photo", type: "image" },
  { key: "resumeUrl", label: "Résumé URL", type: "url", placeholder: "https://… or upload a PDF link" },
  { key: "socials", label: "Social links", type: "pairs", fields: ["label", "url"], labels: ["Label", "URL"] },
  { key: "stats", label: "Stats", type: "pairs", fields: ["value", "label"], labels: ["Value", "Label"] },
];

type CollectionDef = {
  label: string;
  singular: string;
  description: string;
  titleKey: string;
  subtitleKey?: string;
  fields: Field[];
};

export const collections: Record<CollectionKey, CollectionDef> = {
  projects: {
    label: "Apps & Projects",
    singular: "app",
    description: "Apps shown in the showcase. Featured apps get the large pinned slider.",
    titleKey: "name",
    subtitleKey: "category",
    fields: [
      { key: "name", label: "App name", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "color", label: "Brand colour", type: "color" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "features", label: "Key features", type: "list", hint: "One per line." },
      { key: "tags", label: "Tech tags", type: "list", hint: "One per line." },
      { key: "platforms", label: "Platforms", type: "chips", options: ["iOS", "Android", "Web"] },
      { key: "appStore", label: "App Store URL", type: "url" },
      { key: "playStore", label: "Google Play URL", type: "url" },
      { key: "screens", label: "Screenshots", type: "images", hint: "Portrait phone screenshots, up to 3 look best." },
      { key: "banners", label: "Store banners", type: "images", hint: "App Store / Google Play listing images. Shown instead of the phone mockups in the projects section; up to 3 look best." },
      { key: "featured", label: "Featured", type: "toggle" },
    ],
  },
  experience: {
    label: "Experience",
    singular: "role",
    description: "Your work history, newest first.",
    titleKey: "company",
    subtitleKey: "role",
    fields: [
      { key: "company", label: "Company", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "period", label: "Period", type: "text", placeholder: "May 2025 — Present" },
      { key: "location", label: "Location", type: "text" },
      { key: "points", label: "Highlights", type: "list", hint: "One per line." },
    ],
  },
  skills: {
    label: "Skills",
    singular: "skill group",
    description: "Grouped tech stack shown in the marquee and skills grid.",
    titleKey: "title",
    fields: [
      { key: "title", label: "Group title", type: "text" },
      { key: "items", label: "Skills", type: "list", hint: "One per line." },
    ],
  },
  services: {
    label: "Services",
    singular: "service",
    description: "What you offer clients.",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "icon", label: "Icon", type: "select", options: SERVICE_ICONS },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  process: {
    label: "Process",
    singular: "step",
    description: "The steps from idea to App Store.",
    titleKey: "title",
    fields: [
      { key: "title", label: "Step title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  testimonials: {
    label: "Testimonials",
    singular: "testimonial",
    description: "What clients say about working with you.",
    titleKey: "name",
    subtitleKey: "title",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "title", label: "Title / company", type: "text" },
      { key: "quote", label: "Quote", type: "textarea" },
    ],
  },
};

export const COLLECTION_KEYS = Object.keys(collections) as CollectionKey[];

/** Default value for a fresh field of the given type. */
export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "toggle":
      return false;
    case "list":
    case "chips":
    case "images":
    case "pairs":
      return [];
    case "color":
      return "#7c6cff";
    case "select":
      return field.options[0]?.value ?? "";
    default:
      return "";
  }
}

export function emptyItem(fields: Field[]): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  for (const f of fields) item[f.key] = emptyValue(f);
  return item;
}

const MAX_TEXT = 4000;

function str(v: unknown) {
  return typeof v === "string" ? v.slice(0, MAX_TEXT) : v == null ? "" : String(v).slice(0, MAX_TEXT);
}

function strList(v: unknown) {
  return Array.isArray(v) ? v.map(str).map((s) => s.trim()).filter(Boolean).slice(0, 100) : [];
}

/** Coerce untrusted input into exactly the shape the fields describe. */
export function sanitize(fields: Field[], input: unknown): Record<string, unknown> {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = src[f.key];
    switch (f.type) {
      case "toggle":
        out[f.key] = v === true;
        break;
      case "list":
      case "images":
        out[f.key] = strList(v);
        break;
      case "chips":
        out[f.key] = strList(v).filter((x) => f.options.includes(x));
        break;
      case "select":
        out[f.key] = f.options.some((o) => o.value === v) ? v : f.options[0]?.value ?? "";
        break;
      case "color":
        out[f.key] = /^#[0-9a-fA-F]{6}$/.test(str(v)) ? str(v) : "#7c6cff";
        break;
      case "pairs":
        out[f.key] = Array.isArray(v)
          ? v.slice(0, 50).map((row) => {
              const r = (row && typeof row === "object" ? row : {}) as Record<string, unknown>;
              return { [f.fields[0]]: str(r[f.fields[0]]).trim(), [f.fields[1]]: str(r[f.fields[1]]).trim() };
            })
          : [];
        break;
      default:
        out[f.key] = str(v).trim();
    }
  }
  return out;
}

export function slugId(text: string) {
  const base = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return base || "item";
}
