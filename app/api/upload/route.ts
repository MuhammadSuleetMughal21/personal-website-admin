import { NextResponse, type NextRequest } from "next/server";
import { uploadToSite } from "@/lib/api";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/** Forwards an image from the signed-in admin to the site, which stores and serves it. */
export async function POST(request: NextRequest) {
  if (!verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, Date.now())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await request.formData();
  if (!(form.get("file") instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  try {
    return NextResponse.json(await uploadToSite(form));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 502 });
  }
}
