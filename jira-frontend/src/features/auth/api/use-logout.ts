import { useMutation } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/api";
import { useAppDispatch } from "@/stores/hooks";
import { clearSession } from "@/stores/authSlice";
import { clearProjects } from "@/stores/projectSlice";
import { resetWorkspaces } from "@/stores/workspacesSlice";

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      await fetch(`${API_BASE_URL}/auth/sessions/logout`, {
        method: "DELETE",
        credentials: "include",
      });

      dispatch(clearSession());
      dispatch(resetWorkspaces());
      dispatch(clearProjects());
    },
  });
};
