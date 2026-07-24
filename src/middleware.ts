import { NextRequest, NextResponse } from "next/server";

/**
 * Route protection. The middleware only checks that a session cookie is
 * present: it cannot verify the JWT signature (the key lives in the backend),
 * so the API remains the real authority and answers 401 on a forged cookie.
 *
 * Public routes: the sign-in screen and the legal texts, which the welcome
 * screen links to before anyone is authenticated.
 */
const TOKEN_COOKIE = "bw_charter_portal_token";

const PUBLIC_PATHS = ["/login", "/legal"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  if (isPublic(pathname)) {
    // Already signed in and landing on the sign-in screen: go to the charters.
    // Skip this when a `next` is present: the client sends expired sessions to
    // `/login?next=…`, and the cookie can still be there (present but rejected
    // by the API), so bouncing back would trap them in a redirect loop.
    if (
      pathname === "/login" &&
      hasSession &&
      !request.nextUrl.searchParams.has("next")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const target = new URL("/login", request.url);
    // Come back to the requested charter after signing in.
    if (pathname !== "/") {
      target.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(target);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except the proxy, Next internals and static assets.
  matcher: ["/((?!api|_next/static|_next/image|fonts|brand|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|avif|gif|webp)$).*)"],
};
