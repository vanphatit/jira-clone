// src/features/auth/api/use-login.ts
import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { setAccessToken } from "@/lib/auth";

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await fetch(`${API_BASE_URL}/auth/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // Refresh token cookie
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      return data;
    },
  });
};
