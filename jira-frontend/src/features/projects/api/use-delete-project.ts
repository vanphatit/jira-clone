import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useDeleteProject = () =>
  useMutation({
    mutationFn: async (projectId: string) => {
      const res = await authFetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Delete failed");
      }

      return res.json(); // or return `true` if no content (204)
    },
  });
