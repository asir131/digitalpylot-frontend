"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { navItems } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { permissions, user } = useAuth();

  const items = navItems.filter((item) =>
    permissions.includes(item.permission),
  );
  const primary = items.filter((item) =>
    ["Dashboard", "Leads", "Tasks", "Reports"].includes(item.label),
  );
  const users = items.filter((item) =>
    ["Users", "Permissions", "Audit Logs", "Customer Portal"].includes(
      item.label,
    ),
  );
  const other = items.filter((item) => ["Settings"].includes(item.label));

  return (
    <aside className="hidden h-screen w-80 p-6 md:flex">
      <div className="sidebar-shell flex h-full flex-col">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-citrus text-white font-bold">
            O
          </div>
          <div>
            <p className="font-display text-lg text-ink">Overlay</p>
          </div>
        </div>

        <div className="sidebar-card mt-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFD7A6] text-cocoa font-semibold">
            {(user?.name?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-cocoa">{user?.name ?? "Workspace"}</p>
            <p className="text-xs text-mist">{user?.email ?? "Signed in"}</p>
          </div>
          <span className="sidebar-pill">Pro</span>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-4">
          <div className="space-y-1">
            {primary.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx("nav-item", active && "nav-item-active")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            {permissions.includes("reports.view") && pathname.startsWith("/reports") && (
              <div className="ml-7 space-y-1">
                {[
                  { label: "Assignments", href: "/tasks/assignments" },
                  { label: "Calendar", href: "/tasks/calendar" },
                  { label: "Reminders", href: "/tasks/reminders" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-subitem"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {users.length > 0 && (
            <div>
              <p className="px-3 text-xs uppercase tracking-wide text-mist">
                Users
              </p>
              <div className="mt-2 space-y-1">
                {users.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx("nav-item", active && "nav-item-active")}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {other.length > 0 && (
            <div>
              <p className="px-3 text-xs uppercase tracking-wide text-mist">
                Other
              </p>
              <div className="mt-2 space-y-1">
                {other.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx("nav-item", active && "nav-item-active")}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        <div className="mt-4 space-y-2 text-xs text-mist">
          <Link className="nav-item" href="/help-center">
            Help center
          </Link>
        </div>
      </div>
    </aside>
  );
}
