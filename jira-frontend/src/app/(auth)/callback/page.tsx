"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { useAppDispatch } from "@/stores/hooks";
import { setSession } from "@/stores/authSlice";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authenticate = async () => {
      if (token) {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const user = await res.json();
        dispatch(setSession({ accessToken: token, user }));
        router.push("/");
      }
    };

    authenticate();
  }, [token, router, dispatch]);

  return <p className="text-center mt-10">Authenticating...</p>;
}
