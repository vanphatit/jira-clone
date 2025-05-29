// src/stores/projectSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "@/features/projects/types";

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
}

const storedProjectId = localStorage.getItem("project.current");

const initialState: ProjectState = {
  projects: [],
  currentProjectId: storedProjectId ?? null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setCurrentProjectId: (state, action: PayloadAction<string | null>) => {
      state.currentProjectId = action.payload;
      if (action.payload) {
        localStorage.setItem("project.current", action.payload);
      } else {
        localStorage.removeItem("project.current");
      }
    },
    clearProjects: (state) => {
      state.projects = [];
      state.currentProjectId = null;
      localStorage.removeItem("project.current");
    },
  },
});

export const { setProjects, setCurrentProjectId, clearProjects } =
  projectSlice.actions;
export default projectSlice.reducer;
