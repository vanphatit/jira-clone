import { Project } from "../types";
import { authFetch } from "@/lib/auth-fetch";
import { API_BASE_URL } from "@/lib/api";
import { store } from "@/stores";
import { setProjects } from "@/stores/projectSlice";

export const fetchProjectsByWorkspace = async (
    workspaceId: string
): Promise<Project[]> => {
    
    const res = await authFetch(`${API_BASE_URL}/projects/workspace/${workspaceId}`);
    if (res.ok) {
        const projects: Project[] = await res.json();
        store.dispatch(setProjects(projects));

        const currentId = store.getState().project.currentProjectId;
        if (!currentId && projects.length > 0) {
            store.dispatch({ type: "project/setCurrentProjectId", payload: projects[0]._id });
        }
        return projects;
    } else {
        console.warn("⚠️ Failed to fetch projects");
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch projects");
    }
};
