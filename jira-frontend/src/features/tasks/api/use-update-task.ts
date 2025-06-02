import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/auth-fetch";
import { API_BASE_URL } from "@/lib/api";

// Define a type that can handle partial update
interface UpdateTaskPayload {
  _id: string;
  name?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  position?: number;
  assigneeIds?: string[];
  // You can extend more fields if you have
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: UpdateTaskPayload) => {
      const { _id, ...payload } = task;

      const res = await authFetch(`${API_BASE_URL}/tasks/${_id}`, {
        method: "PATCH",
        body: JSON.stringify(payload), // 🔥 Send the dynamic full payload
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate all tasks to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
