"use client";

import type { TaskWithMeta } from "@/lib/hooks/useTasks";
import { PriorityBadge } from "./PriorityBadge";
import clsx from "clsx";

export function TaskTable({
  tasks,
  onToggleComplete,
  onSelect,
}: {
  tasks: TaskWithMeta[];
  onToggleComplete: (taskId: string) => void;
  onSelect: (task: TaskWithMeta) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-2xl border border-steel bg-white md:block">
        <div className="grid grid-cols-[32px_2fr_1fr_1fr_1fr] gap-2 border-b border-steel px-4 py-3 text-xs text-mist">
          <span></span>
          <span>Title</span>
          <span>Client name</span>
          <span>Priority</span>
          <span>Date</span>
        </div>
        <div className="divide-y divide-steel">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={clsx(
                "grid grid-cols-[32px_2fr_1fr_1fr_1fr] gap-2 px-4 py-3 text-sm transition hover:bg-cream/40",
                task.status === "done" && "opacity-70"
              )}
            >
              <button
                type="button"
                onClick={() => onToggleComplete(task._id)}
                className={clsx(
                  "mt-1 h-4 w-4 rounded border border-steel",
                  task.status === "done" && "bg-citrus border-citrus"
                )}
              />
              <button type="button" className="text-left text-ink" onClick={() => onSelect(task)}>
                {task.title}
              </button>
              <span className="text-mist">{task.clientName ?? "Unassigned"}</span>
              <PriorityBadge priority={task.priority} />
              <span className="text-mist">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {tasks.map((task) => (
          <div key={task._id} className="rounded-2xl border border-steel bg-white p-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => onToggleComplete(task._id)}
                className={clsx(
                  "h-4 w-4 rounded border border-steel",
                  task.status === "done" && "bg-citrus border-citrus"
                )}
              />
              <PriorityBadge priority={task.priority} />
            </div>
            <button type="button" className="mt-3 text-left text-base font-semibold text-ink" onClick={() => onSelect(task)}>
              {task.title}
            </button>
            <div className="mt-2 text-xs text-mist">{task.clientName ?? "Unassigned"}</div>
            <div className="mt-1 text-xs text-mist">
              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
