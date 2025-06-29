import { useMutation } from "@tanstack/react-query";

import { CreateProjectDTO } from "../types";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth-fetch";

export const useCreateProject = () =>
  useMutation({
    mutationFn: async (payload: CreateProjectDTO) => {
      
      const res = await authFetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Create failed");
      }

      return res.json();
    },
  });
