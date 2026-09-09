import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, stripLocalePrefix } from "@/lib/i18n";

const PUBLIC_FILE = /\.(?:png|jpg|jpeg|gif|webp|ico|svg|txt|xml|woff2?)$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const { locale } = stripLocalePrefix(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-yak-locale", locale);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
