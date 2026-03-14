"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTasks } from "@/lib/hooks/useTasks";
import { TaskModal } from "@/components/tasks/TaskModal";
import type { TaskWithMeta } from "@/lib/hooks/useTasks";

export default function RemindersPage() {
  const { tasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState<TaskWithMeta | null>(null);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const upcoming = useMemo(() => {
    const filtered = tasks
      .filter((task) => task.dueDate)
      .sort((a, b) => new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime());
    if (!query) return filtered;
    return filtered.filter((task) => task.title.toLowerCase().includes(query));
  }, [tasks, query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Reminders</h2>
        <p className="text-sm text-mist">Upcoming tasks ordered by due date.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {upcoming.map((task) => (
          <button
            key={task._id}
            type="button"
            className="rounded-2xl border border-steel bg-white p-4 text-left shadow-card"
            onClick={() => setSelectedTask(task)}
          >
            <p className="text-sm text-ink">{task.title}</p>
            <p className="mt-1 text-xs text-mist">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</p>
          </button>
        ))}
      </div>
      <TaskModal task={selectedTask} open={Boolean(selectedTask)} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
