import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useDeleteWorkspace = () => {
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const res = await authFetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
        method: "DELETE",
      });

      if (!res.status.toString().startsWith("2")) {
        const error = await res.json();
        throw new Error(error.message || "Delete failed");
      }
    },
  });
};
