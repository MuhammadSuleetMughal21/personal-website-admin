/** Public site origin, usable in client components (for links and image previews). */
export const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Site-relative media paths ("/media/x.png") are served by the site, not the admin. */
export function mediaUrl(src: string) {
  return src.startsWith("/") ? `${PUBLIC_SITE_URL}${src}` : src;
}
