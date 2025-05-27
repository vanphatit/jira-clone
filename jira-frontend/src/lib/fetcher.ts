import { API_BASE_URL } from "./api";
import { getAccessToken, setAccessToken, clearAccessToken } from "./auth";

export const fetchWithAuth = async (
  path: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = new Headers(options.headers || {});
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include", // <- for refreshToken cookie
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.set("Authorization", `Bearer ${refreshed}`);
      res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      throw new Error("Unauthorized and refresh failed");
    }
  }

  return res;
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/sessions/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    clearAccessToken();
    return null;
  }
};
