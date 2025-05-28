import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Workspace {
  _id: string;
  name: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspaceId: null,
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
    },
    resetWorkspaces: (state) => {
      state.workspaces = [];
      state.currentWorkspaceId = null;
    },
  },
});

export const { setWorkspaces, setCurrentWorkspaceId, resetWorkspaces } =
  workspaceSlice.actions;
export default workspaceSlice.reducer;
