import { create } from "zustand";

const channel = new BroadcastChannel("auth");

channel.onmessage = (event) => {
  if (event.data === "LOGOUT") {
    useAuthStore.getState().clearSession();
  }
};

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
  setSession: (token: string, user: User) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setSession: (accessToken, user) =>
    set({ accessToken, user, isAuthenticated: true }),

  clearSession: () => {
    channel.postMessage("LOGOUT");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
