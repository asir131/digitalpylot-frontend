"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { navItems } from "@/lib/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function Topbar() {
  const { user, logout } = useAuth();
  const { push } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = navItems.find((item) => pathname.startsWith(item.href))?.label ?? "Tasks";
  const view = searchParams.get("view") ?? "list";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 300);

  const setView = (nextView: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const currentQuery = searchParams.get("q") ?? "";
    if (currentQuery === debouncedQuery) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedQuery, pathname, router, searchParams]);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

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
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
              onClick={() => setView(tab)}
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
