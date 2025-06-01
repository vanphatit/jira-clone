import { useQuery } from "@tanstack/react-query";
import { Task } from "../types";
import { authFetch } from "@/lib/auth-fetch";
import { API_BASE_URL } from "@/lib/api";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: string | null;
  assigneeId?: string | null;
  search?: string | null;
  dueDate?: string | null;
  sort?: string | null;
  direction?: "asc" | "desc";
}

const buildQueryString = (
  params: Record<string, string | null | undefined>
) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  return query.toString();
};

export const useTasksByProject = ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  search,
  dueDate,
  sort,
  direction,
}: UseGetTasksProps) => {
  return useQuery<Task[]>({
    queryKey: [
      "tasks",
      {
        workspaceId,
        projectId,
        status,
        assigneeId,
        search,
        dueDate,
        sort,
        direction,
      },
    ],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");

      const queryString = buildQueryString({
        status,
        assigneeId,
        search,
        dueDate,
        sort,
        direction,
      });

      const url = `${API_BASE_URL}/tasks/project/${projectId}${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await authFetch(url);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch tasks");
      }

      const tasks: Task[] = await res.json();
      return tasks;
    },
    enabled: !!workspaceId && !!projectId,
  });
};
