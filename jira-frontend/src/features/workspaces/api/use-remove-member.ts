import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useRemoveMember = () => {
  return useMutation({
    mutationFn: async (params: { workspaceId: string; userId: string }) => {
      const { workspaceId, userId } = params;
      const res = await authFetch(
        `${API_BASE_URL}/workspaces/${workspaceId}/members/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Remove member failed");
      }

      return res.json();
    },
  });
};
