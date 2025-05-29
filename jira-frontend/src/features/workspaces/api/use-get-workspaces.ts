import { API_BASE_URL } from "@/lib/api";
import { store } from "@/stores";
import { setWorkspaces, setCurrentWorkspaceId } from "@/stores/workspacesSlice";

export const fetchWorkspaces = async () => {
  const token = store.getState().auth.accessToken;
  if (!token) throw new Error("No token to fetch workspaces");

  const res = await fetch(`${API_BASE_URL}/workspaces`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();
  store.dispatch(setWorkspaces(data));

  const currentId = store.getState().workspace.currentWorkspaceId;
  if (!currentId && data.length > 0) {
    store.dispatch(setCurrentWorkspaceId(data[0]._id));
  }

  return data
};
