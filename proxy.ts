import { type NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/session";

const SESSION_OPTIONS = {
  cookieName: "cb_session",
  password: process.env.SESSION_SECRET!,
  ttl: 30 * 24 * 60 * 60,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

const CB_AUTH_COOKIE = "cb_auth";
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

const PROTECTED_PATTERNS = [
  /^\/course\/[^/]+\/[^/]+\/[^/]+/,
  /^\/change-password$/,
];
const AUTH_PATHS = ["/login", "/signup", "/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, SESSION_OPTIONS);
  const isAuthenticated = !!(session.uid && session.email);

  const isProtected = PROTECTED_PATTERNS.some((pattern) => pattern.test(pathname));
  const isAuthPage = AUTH_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const hasCbAuth = request.cookies.has(CB_AUTH_COOKIE);
  if (isAuthenticated && !hasCbAuth) {
    response.cookies.set(CB_AUTH_COOKIE, "1", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_TTL_SECONDS,
      path: "/",
    });
  } else if (!isAuthenticated && hasCbAuth) {
    response.cookies.delete(CB_AUTH_COOKIE);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
