import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Task, User } from "@/lib/types";

export type TaskWithMeta = Task & {
  assigneeName?: string;
  clientName?: string;
  overdue?: boolean;
};

export function useTasks() {
  const [tasks, setTasks] = useState<TaskWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const taskRes = await apiFetch<{ items: Task[] }>("/api/tasks");
      let usersById = new Map<string, string>();
      try {
        const userRes = await apiFetch<{ items: User[] }>("/api/users");
        usersById = new Map(userRes.items.map((user) => [user.id, user.name]));
      } catch {
        usersById = new Map();
      }
      const now = new Date();
      const mapped = taskRes.items.map((task) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const assigneeName = task.assigneeId ? usersById.get(task.assigneeId) : undefined;
        return {
          ...task,
          assigneeName,
          clientName: assigneeName,
          overdue: Boolean(dueDate && dueDate < now && task.status !== "done"),
        };
      });
      setTasks(mapped);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateTask = useCallback(async (taskId: string, payload: Partial<Task>) => {
    const { task } = await apiFetch<{ task: Task }>(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    setTasks((prev) =>
      prev.map((item) => (item._id === taskId ? { ...item, ...task, _id: taskId } : item))
    );
  }, []);

  const toggleComplete = useCallback(
    async (taskId: string) => {
      const current = tasks.find((task) => task._id === taskId);
      if (!current) return;
      const nextStatus = current.status === "done" ? "open" : "done";
      await updateTask(taskId, { status: nextStatus });
    },
    [tasks, updateTask]
  );

  const setStatus = useCallback(
    async (taskId: string, status: Task["status"]) => {
      await updateTask(taskId, { status });
    },
    [updateTask]
  );

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "done").length;
    const pending = tasks.filter((task) => task.status !== "done").length;
    const overdue = tasks.filter((task) => task.overdue).length;
    return { total, completed, pending, overdue };
  }, [tasks]);

  return { tasks, loading, load, updateTask, toggleComplete, setStatus, stats };
}
