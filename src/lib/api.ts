export class ApiError extends Error {
  public status: number;
  public data: { statusCode: number; message: string | string[]; error: string };
  constructor(status: number, data: { statusCode: number; message: string | string[]; error: string }) {
    const msg = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    super(msg);
    this.status = status;
    this.data = data;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  },
  async post<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(url, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  },
  async patch<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(url, { method: "PATCH", headers: authHeaders(), body: JSON.stringify(data) });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  },
  async delete<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json().catch(() => undefined) as Promise<T>;
  },
};
