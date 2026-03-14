"use client";

import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { LoadingState, EmptyState } from "@/components/ui/States";
import type { Permission } from "@/lib/types";
import { useSearchParams } from "next/navigation";

export default function PermissionsPage() {
  const [items, setItems] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  useEffect(() => {
    apiFetch<{ items: Permission[] }>("/api/permissions")
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((perm) => {
      return (
        perm.key.toLowerCase().includes(query) ||
        perm.label.toLowerCase().includes(query) ||
        perm.module.toLowerCase().includes(query)
      );
    });
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Permissions</h2>
        <p className="text-sm text-mist">Atomic permission library across all modules.</p>
      </div>
      {loading && <LoadingState label="Loading permissions..." />}
      {!loading && filtered.length === 0 && (
        <EmptyState title="No permissions" description="Seed the database to load permissions." />
      )}
      {!loading && filtered.length > 0 && (
        <Card>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Label</th>
                  <th>Module</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((perm) => (
                  <tr key={perm.key}>
                    <td className="text-mist">{perm.key}</td>
                    <td>{perm.label}</td>
                    <td>{perm.module}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
