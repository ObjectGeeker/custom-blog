"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [authReady, isAuthenticated, router]);

  if (authReady && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <>
      {!authReady && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-base-200"
          aria-busy="true"
          aria-label="加载中"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      )}
      {children}
    </>
  );
}
