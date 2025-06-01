import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/auth-fetch";
import { API_BASE_URL } from "@/lib/api";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: {
      _id: string;
      status: string;
      position: number;
    }) => {
      const res = await authFetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: task.status,
          position: task.position,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
