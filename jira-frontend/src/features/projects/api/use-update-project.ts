import { useMutation } from "@tanstack/react-query";
import { UpdateProjectSchema } from "../schemas";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useUpdateProject = () =>
  useMutation({
    mutationFn: async ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: UpdateProjectSchema;
    }) => {
      console.log(
        "Updating project with ID:",
        projectId,
        "and payload:",
        payload
      );
      const res = await authFetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Update failed");
      }

      return res.json();
    },
  });
