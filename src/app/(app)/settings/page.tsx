"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/States";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const [settings, setSettings] = useState<{ brandName: string; supportEmail: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    apiFetch<{ settings: { brandName: string; supportEmail: string } }>("/api/settings")
      .then((data) => setSettings(data.settings))
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Settings</h2>
        <p className="text-sm text-mist">System configuration and support routing.</p>
      </div>
      {loading && <LoadingState label="Loading settings..." />}
      {settings && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="grid gap-4">
              <div>
                <p className="text-xs text-mist">Brand Name</p>
                <p className="text-lg text-ink">{settings.brandName}</p>
              </div>
              <div>
                <p className="text-xs text-mist">Support Email</p>
                <p className="text-lg text-ink">{settings.supportEmail}</p>
              </div>
            </div>
          </Card>
          <Card>
            <p className="text-xs text-mist">User Profile</p>
            <p className="mt-2 text-lg text-ink">{user?.name}</p>
            <p className="text-sm text-mist">{user?.email}</p>
            <div className="mt-4 rounded-xl border border-steel bg-cream p-4 text-xs text-mist">
              Profile settings placeholder.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
