import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useUpdateWorkspace = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const res = await authFetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Update failed");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate workspaces query
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};
