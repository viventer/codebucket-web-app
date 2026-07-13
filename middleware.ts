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

const PROTECTED_PATTERNS = [
  /^\/course\/[^/]+\/[^/]+\/[^/]+/,
  /^\/change-password$/,
];
const AUTH_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
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

  if (isAuthenticated) {
    response.headers.set("x-user-uid", session.uid);
    response.headers.set("x-user-email", session.email);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
