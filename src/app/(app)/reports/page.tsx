"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/States";

export default function ReportsPage() {
  const [stats, setStats] = useState<{ leads: number; tasks: number; users: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ stats: { leads: number; tasks: number; users: number } }>("/api/reports")
      .then((data) => setStats(data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Reports</h2>
        <p className="text-sm text-mist">Real-time operational metrics.</p>
      </div>
      {loading && <LoadingState label="Loading reports..." />}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Pipeline Leads", value: stats.leads },
            { label: "Active Tasks", value: stats.tasks },
            { label: "Total Users", value: stats.users },
          ].map((item) => (
            <Card key={item.label}>
              <p className="text-xs text-mist">{item.label}</p>
              <p className="mt-4 font-display text-3xl text-ink">{item.value}</p>
            </Card>
          ))}
        </div>
      )}
      <Card>
        <h3 className="font-display text-lg">Report Notes</h3>
        <p className="mt-2 text-sm text-mist">
          Reports are generated directly from live data with permission-based visibility.
        </p>
      </Card>
    </div>
  );
}




