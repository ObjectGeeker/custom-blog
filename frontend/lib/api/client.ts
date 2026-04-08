import type { BaseResponse } from "@/lib/types";

const AUTH_TOKEN_KEY = "blog_auth_token";

type TokenChangeListener = (token: string | null) => void;
const tokenChangeListeners = new Set<TokenChangeListener>();

export function onTokenChange(listener: TokenChangeListener): () => void {
  tokenChangeListeners.add(listener);
  return () => {
    tokenChangeListeners.delete(listener);
  };
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  tokenChangeListeners.forEach((l) => l(token));
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  tokenChangeListeners.forEach((l) => l(null));
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ---- token refresh (singleton to avoid concurrent refresh storms) ---- */

let refreshPromise: Promise<boolean> | null = null;

async function doRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch("/api/security/refresh_token", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const json: BaseResponse<{ accessToken: string }> = await res.json();
    if (json.code !== "200") return false;
    setAuthToken(json.data.accessToken);
    return true;
  } catch {
    return false;
  }
}

export function tryRefreshToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = doRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/* ---- generic POST helper with automatic token refresh ---- */

export async function post<T>(url: string, body?: unknown): Promise<T> {
  return doPost(url, body, false);
}

async function doPost<T>(
  url: string,
  body: unknown | undefined,
  isRetry: boolean,
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !isRetry) {
    if (await tryRefreshToken()) return doPost(url, body, true);
    throw new ApiError("40100", "登录已过期，请重新登录");
  }

  if (!res.ok) {
    throw new ApiError(String(res.status), `HTTP ${res.status}`);
  }

  const json: BaseResponse<T> = await res.json();

  if (json.code === "40100" && !isRetry) {
    if (await tryRefreshToken()) return doPost(url, body, true);
    throw new ApiError(json.code, json.message);
  }

  if (json.code !== "200") {
    throw new ApiError(json.code, json.message);
  }

  return json.data;
}
