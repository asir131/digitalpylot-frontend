"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useSearchContext } from "@/context/SearchContext";

export function Topbar() {
  const { user, logout } = useAuth();
  const { push } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const current = navItems.find((item) => pathname.startsWith(item.href))?.label ?? "Tasks";
  const { query, setQuery, view, setView } = useSearchContext();
  const [localQuery, setLocalQuery] = useState(query);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery === localQuery) return;
    setQuery(localQuery);
  }, [debouncedQuery, localQuery, setQuery]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      push({ title: "Logged out", description: "Session ended", tone: "success" });
      router.push("/login");
    } catch {
      push({ title: "Logout failed", description: "Try again", tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-steel bg-white"
          onClick={() => router.back()}
          type="button"
        >
          <ArrowLeft className="h-4 w-4 text-mist" />
        </button>
        <div>
          <p className="text-xs text-mist">Workspace</p>
          <h1 className="font-display text-xl text-ink">{current}</h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-steel bg-white px-4 py-2 text-sm text-mist">
          <Search className="h-4 w-4" />
          <input
            className="w-full bg-transparent text-sm text-ink placeholder:text-mist focus:outline-none"
            placeholder="Search"
            value={localQuery}
            onChange={(event) => setLocalQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-steel bg-white px-2 py-1 text-xs text-mist">
          {["list", "kanban", "calendar"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={view === tab ? "tab-pill tab-pill-active" : "tab-pill"}
              onClick={() => setView(tab as "list" | "kanban" | "calendar")}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="rounded-full border border-steel bg-white px-3 py-2 text-xs text-mist">
          {user?.email}
        </div>
        <Button variant="secondary" disabled={loading} onClick={handleLogout}>
          {loading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}
