"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/lib/hooks/useTasks";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskModal } from "@/components/tasks/TaskModal";
import type { TaskWithMeta } from "@/lib/hooks/useTasks";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { tasks, toggleComplete } = useTasks();
  const [selectedTask, setSelectedTask] = useState<TaskWithMeta | null>(null);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();

  const assigned = useMemo(() => {
    const filtered = tasks.filter((task) => task.assigneeId === user?.id);
    if (!query) return filtered;
    return filtered.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        (task.clientName ?? "").toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
      );
    });
  }, [tasks, user?.id, query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Assignments</h2>
        <p className="text-sm text-mist">Tasks assigned to you.</p>
      </div>
      <TaskTable tasks={assigned} onToggleComplete={toggleComplete} onSelect={setSelectedTask} />
      <TaskModal task={selectedTask} open={Boolean(selectedTask)} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
