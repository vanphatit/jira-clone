import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { useAppDispatch } from "@/stores/hooks";
import { setSession } from "@/stores/authSlice";

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await fetch(`${API_BASE_URL}/auth/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }

      const { accessToken } = await res.json();

      const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });

      if (!userRes.ok) throw new Error("Failed to fetch user data");

      const user = await userRes.json();
      dispatch(setSession({ accessToken, user }));
      return { accessToken, user };
    },
  });
};
