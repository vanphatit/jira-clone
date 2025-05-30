// src/stores/projectSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "@/features/projects/types";

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProjectId: null,
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
    },
    clearProjects: (state) => {
      state.projects = [];
      state.currentProjectId = null;
    },
  },
});

export const { setProjects, setCurrentProjectId, clearProjects } =
  projectSlice.actions;
export default projectSlice.reducer;
