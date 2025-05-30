import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useAcceptInvite = () =>
  useMutation({
    mutationFn: async (params: { workspaceId: string; email: string }) => {
      const { workspaceId, email } = params;
      const res = await authFetch(
        `${API_BASE_URL}/workspaces/accept?workspaceId=${workspaceId}&email=${encodeURIComponent(
          email
        )}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Accept invite failed");
      }

      return res.json();
    },
  });
