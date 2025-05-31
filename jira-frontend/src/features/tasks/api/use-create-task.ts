import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTaskSchema } from "../schemas";
import { authFetch } from "@/lib/auth-fetch";
import { API_BASE_URL } from "@/lib/api";

export const useCreateTask = (projectId: string) => {

  return useMutation({
    mutationFn: async (payload: CreateTaskSchema) => {
      const res = await authFetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create task");
      }

      return res;
    },
  });
};
