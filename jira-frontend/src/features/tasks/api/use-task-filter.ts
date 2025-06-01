import { useSearchParams, useRouter } from "next/navigation";
import { TaskStatus } from "../types";

export const useTaskFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");
  const workspaceId = searchParams.get("workspaceId");
  const status = searchParams.get("status") as TaskStatus | null;
  const search = searchParams.get("search");
  const dueDate = searchParams.get("dueDate");
  const sort = searchParams.get("sort") || "dueDate";
  const direction = (searchParams.get("direction") as "asc" | "desc") || "asc"; // <-- default "asc"
  const assigneeId = searchParams.get("assigneeId");

  const setFilters = (
    updates: Partial<Record<string, string | string[] | null>>
  ) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`);
  };

  return [
    {
      projectId,
      workspaceId,
      status,
      assigneeId,
      search,
      dueDate,
      sort,
      direction,
    },
    setFilters,
  ] as const;
};
