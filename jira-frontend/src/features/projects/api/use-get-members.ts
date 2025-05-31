import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useGetMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const res = await authFetch(
        `${API_BASE_URL}/projects/${projectId}/members`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch members");
      }
      return res.json();
    },
    enabled: !!projectId,
  });
};
