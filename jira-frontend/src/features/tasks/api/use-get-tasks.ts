import { useQuery } from "@tanstack/react-query";
import { Task } from "../types";
import { authFetch } from "@/lib/auth-fetch";
import { API_BASE_URL } from "@/lib/api";

export const useGetTasksByProject = (projectId: string | undefined) => {
  return useQuery<Task[]>({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const res = await authFetch(`${API_BASE_URL}/tasks/project/${projectId}`);
      return res;
    },
    enabled: !!projectId,
  });
};
