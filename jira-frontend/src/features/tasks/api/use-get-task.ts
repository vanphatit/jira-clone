import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/auth-fetch";
import { API_BASE_URL } from "@/lib/api";

export const useGetTask = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await authFetch(`${API_BASE_URL}/tasks/${taskId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch task");
      }
      return res.json();
    },
    enabled: !!taskId, // only fetch when taskId is defined
  });
};
