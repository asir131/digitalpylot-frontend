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

type Task = {
  _id: string;
  title: string;
  status: string;
  priority: string;
};

const emptyTask = { title: "", status: "open", priority: "medium" };

export default function TasksPage() {
  const { push } = useToast();
  const { permissions } = useAuth();
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyTask);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ items: Task[] }>("/api/tasks");
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
    if (!permissions.includes("tasks.create")) return;
    setEditing(null);
    setForm(emptyTask);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    if (!permissions.includes("tasks.update")) return;
    setEditing(task);
    setForm({ title: task.title, status: task.status, priority: task.priority });
    setModalOpen(true);
  };

  const submitForm = async () => {
    try {
      if (editing) {
        if (!permissions.includes("tasks.update")) throw new Error("Missing permission");
        await apiFetch(`/api/tasks/${editing._id}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
        push({ title: "Task updated", tone: "success" });
      } else {
        if (!permissions.includes("tasks.create")) throw new Error("Missing permission");
        await apiFetch(`/api/tasks`, { method: "POST", body: JSON.stringify(form) });
        push({ title: "Task created", tone: "success" });
      }
      setModalOpen(false);
      await loadData();
    } catch {
      push({ title: "Save failed", description: "Check permissions", tone: "error" });
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      if (!permissions.includes("tasks.delete")) throw new Error("Missing permission");
      await apiFetch(`/api/tasks/${confirmId}`, { method: "DELETE" });
      push({ title: "Task deleted", tone: "success" });
      setConfirmId(null);
      await loadData();
    } catch {
      push({ title: "Delete failed", tone: "error" });
    }
  };

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
      );
    });
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink">Tasks</h2>
          <p className="text-sm text-mist">Coordinate deliverables and priorities.</p>
        </div>
        {permissions.includes("tasks.create") && <Button onClick={openCreate}>New Task</Button>}
      </div>

      {loading && <LoadingState label="Loading tasks..." />}
      {!loading && filtered.length === 0 && (
        <EmptyState title="No tasks" description="Create your first task to stay on track." />
      )}
      {!loading && filtered.length > 0 && (
        <Card>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td className="text-mist">{task.status}</td>
                    <td>{task.priority}</td>
                    <td className="flex flex-wrap gap-2">
                      {permissions.includes("tasks.update") && (
                        <Button variant="secondary" onClick={() => openEdit(task)}>
                          Edit
                        </Button>
                      )}
                      {permissions.includes("tasks.delete") && (
                        <Button variant="ghost" onClick={() => setConfirmId(task._id)}>
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

      <Modal open={modalOpen} title={editing ? "Edit Task" : "Create Task"} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <Input placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </Select>
          <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
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
        title="Delete task"
        description="This will permanently remove the task. Continue?"
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
