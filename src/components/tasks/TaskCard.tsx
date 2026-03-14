import { PriorityBadge } from "./PriorityBadge";
import type { TaskWithMeta } from "@/lib/hooks/useTasks";

export function TaskCard({ task }: { task: TaskWithMeta }) {
  return (
    <div className="rounded-2xl border border-steel bg-white p-4 shadow-card">
      <p className="text-sm text-ink">{task.title}</p>
      <p className="mt-1 text-xs text-mist">Client name: {task.clientName ?? "Unassigned"}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-mist">
        <PriorityBadge priority={task.priority} />
        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</span>
      </div>
    </div>
  );
}
