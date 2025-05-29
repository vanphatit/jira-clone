// src/stores/workspaceSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Workspace {
  _id: string;
  name: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
}

const storedWorkspaceId = localStorage.getItem("workspace.current");

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspaceId: storedWorkspaceId ?? null,
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspaceId: (state, action: PayloadAction<string>) => {
      state.currentWorkspaceId = action.payload;
      localStorage.setItem("workspace.current", action.payload);
    },
    resetWorkspaces: (state) => {
      state.workspaces = [];
      state.currentWorkspaceId = null;
      localStorage.removeItem("workspace.current");
    },
  },
});

export const { setWorkspaces, setCurrentWorkspaceId, resetWorkspaces } =
  workspaceSlice.actions;
export default workspaceSlice.reducer;
