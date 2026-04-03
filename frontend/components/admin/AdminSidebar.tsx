"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FolderTree, Tags, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/articles", label: "文章管理", icon: FileText },
  { href: "/admin/categories", label: "分类管理", icon: FolderTree },
  { href: "/admin/tags", label: "标签管理", icon: Tags },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-secondary/30">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/admin/articles" className="text-lg font-semibold tracking-tight">
          后台管理
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => {
            logout();
            window.location.href = "/admin/login";
          }}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
