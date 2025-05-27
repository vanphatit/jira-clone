import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Verification failed");
      }

      return res.json();
    },
  });
