"use client";

import { useEffect } from "react";
import { store } from "../stores";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import { refreshAccessToken } from "@/lib/auth-fetch";
import { setSession, clearSession } from "../stores/authSlice";
import { fetchWorkspaces } from "@/features/workspaces/api/use-get-workspaces";

let isHydrated = false;

export const useAuthHydration = () => {
  useEffect(() => {
    if (isHydrated) return; // Prevent multiple hydrations
    isHydrated = true; // Set hydration flag

    const hydrate = async () => {
      const token = await refreshAccessToken();
      if (!token) {
        console.error("Failed to refresh access token");
        toast.error("Session expired. Please log in again.");
        store.dispatch(clearSession());
        window.location.href = "/sign-in";
        return;
      }
      console.log("✅ Refreshed access token:", token);

      // Step 2: use that token to fetch user info
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Unauthorized");

      const user = await res.json();

      store.dispatch(setSession({ accessToken: token, user }));
      console.log("✅ Hydrated user:", user.name);

      // Step 3: Fetch workspaces after successful auth
      console.log("Fetching workspaces after auth success...");

      await fetchWorkspaces(); // load workspaces after auth success
    };
    try {
      hydrate();
    } catch (error) {
      console.error("Auth hydration failed:", error);
      toast.error("Session expired. Please log in again.");
      store.dispatch(clearSession());
      window.location.href = "/sign-in";
    }
  }, []);
};
