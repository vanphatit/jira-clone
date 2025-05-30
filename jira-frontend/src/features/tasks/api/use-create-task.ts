import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTaskSchema } from "../schemas";
import { authFetch } from "@/lib/auth-fetch";
import { API_BASE_URL } from "@/lib/api";

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskSchema) => {
      const res = await authFetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]);
    },
  });
};
