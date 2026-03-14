"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { LoadingState, EmptyState } from "@/components/ui/States";
import { useSearchParams } from "next/navigation";

export default function AuditLogsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  useEffect(() => {
    apiFetch<{ items: any[] }>("/api/audit-logs")
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((log) => {
      return (
        String(log.action ?? "").toLowerCase().includes(query) ||
        String(log.targetType ?? "").toLowerCase().includes(query) ||
        String(log.actorId ?? "").toLowerCase().includes(query)
      );
    });
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Audit Logs</h2>
        <p className="text-sm text-mist">Append-only history of sensitive actions.</p>
      </div>
      {loading && <LoadingState label="Loading audit logs..." />}
      {!loading && filtered.length === 0 && (
        <EmptyState title="No logs yet" description="Audit logs will appear as actions occur." />
      )}
      {!loading && filtered.length > 0 && (
        <Card>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Actor</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log._id}>
                    <td>{log.action}</td>
                    <td className="text-mist">{log.targetType}</td>
                    <td>{log.actorId ?? "System"}</td>
                    <td className="text-mist">{new Date(log.createdAt).toLocaleString()}</td>
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
