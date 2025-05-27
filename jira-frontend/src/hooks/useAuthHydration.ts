"use client"

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

export const useAuthHydration = () => {
  useEffect(() => {
    const hydrate = async () => {
      try {
        const refresh = await fetch(`${API_BASE_URL}/auth/sessions/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refresh.ok) {
            throw new Error("Refresh token failed!")
        }
        const { accessToken } = await refresh.json();

        const me = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        if (!me.ok) throw new Error("Failed to fetch user");
        const user = await me.json();

        useAuthStore.getState().setSession(accessToken, user);
      } catch {
        toast.error("Session expired. Please log in again.");
        useAuthStore.getState().clearSession();
      }
    };

    hydrate();
  }, []);
};
