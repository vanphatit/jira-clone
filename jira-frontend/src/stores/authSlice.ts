// src/stores/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "PENDING" | "ACTIVED" | "BANNED";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const storedUser = localStorage.getItem("auth.user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: null,
  isAuthenticated: !!storedUser,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) => {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      state.user = user;
      state.isAuthenticated = true;

      localStorage.setItem("auth.user", JSON.stringify(user));
    },
    clearSession: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth.user");
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
