"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { SearchProvider } from "@/context/SearchContext";
import { ToastViewport } from "@/components/ui/ToastViewport";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <SearchProvider>
          {children}
          <ToastViewport />
        </SearchProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
