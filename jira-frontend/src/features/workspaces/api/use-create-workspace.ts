import { useMutation } from "@tanstack/react-query";
import { CreateWorkspaceDTO, Workspace } from "../types";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useCreateWorkspace = () =>
  useMutation({
    mutationFn: async (payload: CreateWorkspaceDTO): Promise<Workspace> => {
      const res = await authFetch(`${API_BASE_URL}/workspaces`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create workspace");
      }

      return res.json();
    },
  });
