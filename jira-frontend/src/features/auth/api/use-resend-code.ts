import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";

export const useResendCode = () =>
  useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await fetch(`${API_BASE_URL}/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to resend code");
      }

      return res.json();
    },
  });
