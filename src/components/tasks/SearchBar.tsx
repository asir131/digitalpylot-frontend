"use client";

import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search table",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-steel bg-white px-4 py-2 text-sm text-mist">
      <Search className="h-4 w-4" />
      <input
        className="w-full bg-transparent text-sm text-ink placeholder:text-mist focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
