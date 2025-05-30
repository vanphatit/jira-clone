import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useGetMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const res = await authFetch(
        `${API_BASE_URL}/workspaces/${workspaceId}/members`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch members");
      }
      return res.json();
    },
    enabled: !!workspaceId,
  });
};
