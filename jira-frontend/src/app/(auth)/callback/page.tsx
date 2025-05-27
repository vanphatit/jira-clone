"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAccessToken } from "@/lib/auth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      setAccessToken(token);
      router.push("/dashboard");
    }
  }, [token, router]);

  return <p className="text-center mt-10">Authenticating...</p>;
}
