export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  let res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    credentials: "include",
  });

  if (res.status === 401 && path !== "/api/auth/refresh" && path !== "/api/auth/login") {
    await fetch(`${API_URL}/api/auth/refresh`, { method: "POST", credentials: "include" }).catch(() => null);
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      credentials: "include",
    });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message ?? "Request failed");
  }
  return data as T;
}
