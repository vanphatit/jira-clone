"use client";

import { useEffect } from "react";
import { store } from "../stores";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import { refreshAccessToken } from "@/lib/auth-fetch";
import { setSession, clearSession } from "../stores/authSlice";
import { fetchWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { fetchProjectsByWorkspace } from "@/features/projects/api/use-get-projects";

let isHydrated = false;

export const useAuthHydration = () => {
  useEffect(() => {
    if (isHydrated) return;
    isHydrated = true;

    const hydrate = async () => {
      const token = await refreshAccessToken();
      if (!token) {
        console.error("Failed to refresh access token");
        toast.error("Session expired. Please log in again.");
        store.dispatch(clearSession());
        window.location.href = "/sign-in";
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Unauthorized");

      const user = await res.json();

      store.dispatch(setSession({ accessToken: token, user }));

      await fetchWorkspaces();

      const workspaceId = store.getState().workspace.currentWorkspaceId;
      if (!workspaceId) return;

      await fetchProjectsByWorkspace(workspaceId);
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
