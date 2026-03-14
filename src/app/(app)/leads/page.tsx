"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { LoadingState, EmptyState } from "@/components/ui/States";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

type Lead = {
  _id: string;
  title: string;
  status: string;
  value?: number;
};

const emptyLead = { title: "", status: "new", value: 0 };

export default function LeadsPage() {
  const { push } = useToast();
  const { permissions } = useAuth();
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState(emptyLead);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ items: Lead[] }>("/api/leads");
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    if (!permissions.includes("leads.create")) return;
    setEditing(null);
    setForm(emptyLead);
    setModalOpen(true);
  };

  const openEdit = (lead: Lead) => {
    if (!permissions.includes("leads.update")) return;
    setEditing(lead);
    setForm({ title: lead.title, status: lead.status, value: lead.value ?? 0 });
    setModalOpen(true);
  };

  const submitForm = async () => {
    try {
      if (editing) {
        if (!permissions.includes("leads.update")) throw new Error("Missing permission");
        await apiFetch(`/api/leads/${editing._id}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
        push({ title: "Lead updated", tone: "success" });
      } else {
        if (!permissions.includes("leads.create")) throw new Error("Missing permission");
        await apiFetch(`/api/leads`, { method: "POST", body: JSON.stringify(form) });
        push({ title: "Lead created", tone: "success" });
      }
      setModalOpen(false);
      await loadData();
    } catch (error) {
      push({ title: "Save failed", description: "Check permissions", tone: "error" });
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      if (!permissions.includes("leads.delete")) throw new Error("Missing permission");
      await apiFetch(`/api/leads/${confirmId}`, { method: "DELETE" });
      push({ title: "Lead deleted", tone: "success" });
      setConfirmId(null);
      await loadData();
    } catch {
      push({ title: "Delete failed", tone: "error" });
    }
  };

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((lead) => {
      return (
        lead.title.toLowerCase().includes(query) ||
        lead.status.toLowerCase().includes(query)
      );
    });
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink">Leads</h2>
          <p className="text-sm text-mist">Track pipeline progress and deal value.</p>
        </div>
        {permissions.includes("leads.create") && <Button onClick={openCreate}>New Lead</Button>}
      </div>

      {loading && <LoadingState label="Loading leads..." />}
      {!loading && filtered.length === 0 && (
        <EmptyState title="No leads" description="Create your first lead to start tracking." />
      )}
      {!loading && filtered.length > 0 && (
        <Card>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead._id}>
                    <td>{lead.title}</td>
                    <td className="text-mist">{lead.status}</td>
                    <td>${lead.value ?? 0}</td>
                    <td className="flex flex-wrap gap-2">
                      {permissions.includes("leads.update") && (
                        <Button variant="secondary" onClick={() => openEdit(lead)}>
                          Edit
                        </Button>
                      )}
                      {permissions.includes("leads.delete") && (
                        <Button variant="ghost" onClick={() => setConfirmId(lead._id)}>
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={modalOpen} title={editing ? "Edit Lead" : "Create Lead"} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <Input placeholder="Lead title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </Select>
          <Input
            type="number"
            placeholder="Deal value"
            value={form.value ?? 0}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitForm}>{editing ? "Save" : "Create"}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Delete lead"
        description="This will permanently remove the lead. Continue?"
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
