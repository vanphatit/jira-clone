"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // new
import { store, persistor } from "@/stores"; // updated
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

export function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </PersistGate>
    </Provider>
  );
}
