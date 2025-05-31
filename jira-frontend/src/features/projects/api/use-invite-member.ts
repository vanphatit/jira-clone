import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useInviteMember = (projectId: string) =>
  useMutation({
    mutationFn: async (payload: {
      email: string;
      role: "MEMBER" | "ADMIN";
    }) => {
      const res = await authFetch(
        `${API_BASE_URL}/projects/${projectId}/invite`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Invite failed");
      }

      return res.json();
    },
  });
