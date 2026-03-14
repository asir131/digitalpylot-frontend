"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { LoadingState, EmptyState } from "@/components/ui/States";
import { useSearchParams } from "next/navigation";

export default function CustomerPortalPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  useEffect(() => {
    apiFetch<{ items: any[] }>("/api/customers")
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((cust) => {
      return (
        String(cust.name ?? "").toLowerCase().includes(query) ||
        String(cust.email ?? "").toLowerCase().includes(query) ||
        String(cust.status ?? "").toLowerCase().includes(query)
      );
    });
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Customer Portal</h2>
        <p className="text-sm text-mist">Customer profiles and engagement status.</p>
      </div>
      {loading && <LoadingState label="Loading customers..." />}
      {!loading && filtered.length === 0 && (
        <EmptyState title="No customers" description="Customers will appear once they are onboarded." />
      )}
      {!loading && filtered.length > 0 && (
        <Card>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cust) => (
                  <tr key={cust._id ?? cust.id}>
                    <td>{cust.name}</td>
                    <td className="text-mist">{cust.email}</td>
                    <td>
                      <span className="badge">{cust.status}</span>
                    </td>
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
