import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  repassword: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }

      return res.json();
    }
  });
};
