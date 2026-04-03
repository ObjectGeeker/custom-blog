"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/auth-context";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <AuthGuard>
          <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
              <div className="p-6">{children}</div>
            </div>
          </div>
        </AuthGuard>
      )}
    </AuthProvider>
  );
}
