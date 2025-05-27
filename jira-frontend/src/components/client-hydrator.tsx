"use client";

import { useAuthHydration } from "@/hooks/useAuthHydration";

export function ClientHydrator() {
  useAuthHydration();
  return null;
}
