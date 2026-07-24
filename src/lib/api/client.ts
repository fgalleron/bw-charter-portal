/**
 * Portal API client. Every call goes to the Next proxy on the same origin,
 * which attaches the session JWT from the httpOnly cookie.
 *
 * The session lasts 30 minutes and slides forward on every request (the API
 * re-issues the cookie each time). When it finally expires, the API answers 401
 * and this client hard-redirects to the sign-in screen instead of letting the
 * caller surface a misleading "not available" error.
 */
export const API_PREFIX = "/api/charter-portal";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function extractMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const key of ["error", "detail", "message", "hydra:description", "title"]) {
      const value = d[key];
      if (typeof value === "string" && value.trim() !== "") return value;
    }
  }
  return fallback;
}

/**
 * Auth endpoints where a 401 is an expected answer (wrong code, already signed
 * out) rather than an expired session, so it must NOT bounce to the sign-in
 * screen.
 */
const NO_REDIRECT_ENDPOINTS = ["/auth/request-code", "/auth/verify", "/auth/logout"];

/** Hard-redirect to the sign-in screen, remembering where the client was. */
function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  if (pathname === "/login") return;

  const next = `${pathname}${search}`;
  const target = next && next !== "/" ? `/login?next=${encodeURIComponent(next)}` : "/login";
  window.location.replace(target);
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: extraHeaders, ...rest } = options;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const headers = new Headers(extraHeaders as HeadersInit | undefined);
  if (!isFormData && body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${API_PREFIX}${endpoint}`, {
      ...rest,
      headers,
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Unable to reach the server", 0);
  }

  // An expired session answers 401: send the client back to sign-in (except on
  // the auth endpoints, where a 401 is an expected state).
  const skipRedirect = NO_REDIRECT_ENDPOINTS.some((prefix) => endpoint.startsWith(prefix));
  if (response.status === 401 && !skipRedirect) {
    redirectToLogin();
    throw new ApiError("Your session has expired", 401);
  }

  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = undefined;
    }
    throw new ApiError(extractMessage(data, response.statusText || "Request failed"), response.status, data);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

export const apiGet = <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "GET" });

export const apiPost = <T>(endpoint: string, body?: unknown) =>
  apiRequest<T>(endpoint, { method: "POST", body });
