"use client";

import { Provider } from "react-redux";
import { store } from "@/stores";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

export function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryProvider>
        <Toaster />
        {children}
      </QueryProvider>
    </Provider>
  );
}
