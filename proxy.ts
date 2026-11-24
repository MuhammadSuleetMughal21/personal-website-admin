import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/** Every page and API route requires a session, except the login screen. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, Date.now());

  if (pathname === "/login") {
    return authed ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }
  if (!authed) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next internals and static files.
  matcher: ["/((?!_next/|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
