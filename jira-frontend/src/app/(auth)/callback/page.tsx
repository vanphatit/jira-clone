"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { API_BASE_URL } from "@/lib/api";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const authenticate = async () => {
      if (token) {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const user = await res.json();
        useAuthStore.getState().setSession(token, user);      
        router.push("/dashboard");
      }
    };
    
    authenticate();
  }, [token, router]);

  return <p className="text-center mt-10">Authenticating...</p>;
}
