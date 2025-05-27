// src/features/auth/api/use-logout.ts
import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { clearAccessToken } from "@/lib/auth";

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await fetch(`${API_BASE_URL}/auth/sessions/logout`, {
        method: "DELETE",
        credentials: "include",
      });
      clearAccessToken();
    },
  });
};
