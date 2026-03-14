"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { navItems } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { permissions } = useAuth();

  const items = navItems.filter((item) => permissions.includes(item.permission));

  return (
    <div className="md:hidden">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Menu
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 p-6">
          <div className="panel h-full overflow-auto p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg text-ink">DigitalPylot</p>
                <p className="text-xs text-mist">RBAC Navigation</p>
              </div>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
            <nav className="mt-8 flex flex-col gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                      active ? "bg-white text-ink shadow-card" : "text-mist hover:bg-white/60 hover:text-ink"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <Link href="/help-center" onClick={() => setOpen(false)} className="nav-item">
                Help center
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
