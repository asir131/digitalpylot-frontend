"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTasks } from "@/lib/hooks/useTasks";
import { TaskTable } from "@/components/tasks/TaskTable";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { CalendarView } from "@/components/tasks/CalendarView";
import { TaskModal } from "@/components/tasks/TaskModal";
import type { TaskWithMeta } from "@/lib/hooks/useTasks";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "list";
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const { tasks, toggleComplete, setStatus, stats } = useTasks();
  const [selectedTask, setSelectedTask] = useState<TaskWithMeta | null>(null);

  const filtered = useMemo(() => {
    if (!query) return tasks;
    return tasks.filter((task) => {
      const title = task.title.toLowerCase();
      const client = (task.clientName ?? "").toLowerCase();
      const priority = task.priority.toLowerCase();
      return title.includes(query) || client.includes(query) || priority.includes(query);
    });
  }, [query, tasks]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-mist">Overview</p>
              <h2 className="mt-1 font-display text-2xl text-ink">Tasks</h2>
            </div>
            <div className="flex items-center gap-2">
              {[
                { label: "Total", value: stats.total },
                { label: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length },
                { label: "Completed", value: stats.completed },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-steel bg-cream px-3 py-2 text-xs">
                  <p className="text-mist">{item.label}</p>
                  <p className="text-ink font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {view === "list" && (
            <div className="mt-4">
              <TaskTable tasks={filtered} onToggleComplete={toggleComplete} onSelect={setSelectedTask} />
            </div>
          )}

          {view === "calendar" && (
            <div className="mt-4">
              <CalendarView tasks={filtered} />
            </div>
          )}

          {view === "kanban" && (
            <div className="mt-4">
              <KanbanBoard tasks={filtered} onStatusChange={setStatus} />
            </div>
          )}
        </div>

        <div className="panel h-full overflow-hidden">
          <div className="p-6">
            <p className="text-xs text-mist">Summary</p>
            <h3 className="mt-2 font-display text-xl text-ink">Task health</h3>
            <div className="mt-4 grid gap-3">
              {[
                { label: "Total Tasks", value: stats.total },
                { label: "Completed", value: stats.completed },
                { label: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length },
                { label: "In Queue", value: tasks.filter((t) => t.status !== "done").length },
                { label: "Overdue", value: stats.overdue },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-steel bg-cream p-4">
                  <p className="text-xs text-mist">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-steel bg-white p-4 text-xs text-mist">
              Completion chart placeholder
            </div>
          </div>
        </div>
      </div>

      <TaskModal task={selectedTask} open={Boolean(selectedTask)} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
