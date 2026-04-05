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
    <aside className="flex w-60 shrink-0 flex-col border-r border-base-300 bg-base-100">
      <div className="flex h-14 items-center border-b border-base-300 px-4">
        <Link
          href="/admin/articles"
          className="text-lg font-semibold tracking-tight text-base-content"
        >
          后台管理
        </Link>
      </div>

      <ul className="menu menu-lg w-full flex-1 flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href} className="w-full">
              <Link
                href={item.href}
                className={cn(
                  "min-h-11 py-2.5 text-base",
                  active && "menu-active bg-primary text-primary-content",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-base-300 p-3">
        <button
          type="button"
          onClick={() => {
            logout();
            window.location.href = "/admin/login";
          }}
          className="btn btn-ghost btn-sm w-full justify-start font-normal text-base-content/70"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
