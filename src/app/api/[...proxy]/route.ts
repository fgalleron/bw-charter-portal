import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy between the portal and the Symfony API.
 *
 * It turns the httpOnly session cookie into an `Authorization: Bearer` header,
 * so the JWT is never readable from client-side JavaScript, and forwards every
 * Set-Cookie back (sign-in, refresh, logout).
 *
 * Bodies are streamed rather than buffered, so document uploads (multipart)
 * pass through untouched, and redirects are forwarded verbatim so the agreement
 * download can 302 the browser straight to its presigned URL.
 */
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8033";
const TOKEN_COOKIE = "bw_charter_portal_token";

/** Hop-by-hop headers that must never be copied to the upstream request. */
const STRIPPED_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
  "accept-encoding",
]);

async function handle(request: NextRequest, context: { params: Promise<{ proxy: string[] }> }) {
  const { proxy } = await context.params;
  const url = new URL(request.url);
  const target = `${BACKEND_URL}/api/${proxy.join("/")}${url.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      // Streaming keeps multipart uploads intact and avoids buffering large files.
      body: hasBody ? request.body : undefined,
      // Required by undici whenever a stream is used as the body.
      ...(hasBody ? { duplex: "half" } : {}),
      // The agreement download answers 302 to a presigned URL: hand that
      // redirect to the browser instead of following it server-side.
      redirect: "manual",
      cache: "no-store",
    } as RequestInit);
  } catch {
    return NextResponse.json({ error: "Unable to reach the API" }, { status: 502 });
  }

  const responseHeaders = new Headers();
  const passthrough = ["content-type", "content-disposition", "location", "cache-control"];
  for (const name of passthrough) {
    const value = upstream.headers.get(name);
    if (value) {
      responseHeaders.set(name, value);
    }
  }

  // Multiple Set-Cookie headers (session + refresh) must each survive.
  for (const cookie of upstream.headers.getSetCookie?.() ?? []) {
    responseHeaders.append("set-cookie", cookie);
  }

  // 204/304 must not carry a body.
  if (upstream.status === 204 || upstream.status === 304) {
    return new NextResponse(null, { status: upstream.status, headers: responseHeaders });
  }

  return new NextResponse(upstream.body, { status: upstream.status, headers: responseHeaders });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

// Streaming a request body requires the Node.js runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
