"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type SearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  view: "list" | "kanban" | "calendar";
  setView: (value: "list" | "kanban" | "calendar") => void;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "kanban" | "calendar">("list");

  useEffect(() => {
    setQuery("");
    setView("list");
  }, [pathname]);

  const value = useMemo(() => ({ query, setQuery, view, setView }), [query, view]);

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearchContext() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchContext must be used within SearchProvider");
  return ctx;
}
