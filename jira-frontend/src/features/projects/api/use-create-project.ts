import { useMutation } from "@tanstack/react-query";

import { CreateProjectDTO } from "../types";
import { API_BASE_URL } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export const useCreateProject = () =>
  useMutation({
    mutationFn: async (payload: CreateProjectDTO) => {
      const token = useAuthStore.getState().accessToken;
      
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ inject token here
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Create failed");
      }

      return res.json();
    },
  });
