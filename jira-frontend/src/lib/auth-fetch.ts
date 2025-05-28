import { store } from "../stores";
import { API_BASE_URL } from "./api";
import { clearSession, setSession } from "../stores/authSlice";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = fetch(`${API_BASE_URL}/auth/sessions/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Refresh failed");
      const { accessToken } = await res.json();
      const user = store.getState().auth.user;
      if (user) {
        store.dispatch(setSession({ accessToken, user }));
      }
      return accessToken;
    })
    .catch(() => {
      store.dispatch(clearSession());
      return null;
    })
    .finally(() => {
      isRefreshing = false;
    });

  return refreshPromise;
};

export const authFetch = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  const token = store.getState().auth.accessToken;

  const makeRequest = (accessToken: string | null) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

  let res = await makeRequest(token);
  if (res.status !== 401) return res;

  const newToken = await refreshAccessToken();
  if (!newToken) return res;

  return await makeRequest(newToken);
};
