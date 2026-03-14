"use client";

export const dynamic = "force-dynamic";
import { useMemo, useState } from "react";
import { useSearchContext } from "@/context/SearchContext";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/lib/hooks/useTasks";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskModal } from "@/components/tasks/TaskModal";
import type { TaskWithMeta } from "@/lib/hooks/useTasks";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { tasks, toggleComplete } = useTasks();
  const [selectedTask, setSelectedTask] = useState<TaskWithMeta | null>(null);
  const { query } = useSearchContext();
  const normalized = query.toLowerCase();

  const assigned = useMemo(() => {
    const filtered = tasks.filter((task) => task.assigneeId === user?.id);
    if (!normalized) return filtered;
    return filtered.filter((task) => {
      return (
        task.title.toLowerCase().includes(normalized) ||
        (task.clientName ?? "").toLowerCase().includes(normalized) ||
        task.priority.toLowerCase().includes(normalized)
      );
    });
  }, [tasks, user?.id, normalized]);

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




