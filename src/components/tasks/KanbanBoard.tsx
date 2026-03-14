"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskWithMeta } from "@/lib/hooks/useTasks";
import { PriorityBadge } from "./PriorityBadge";
import { useState } from "react";

const columns = [
  { id: "open", title: "Backlog" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Review" },
] as const;

type ColumnId = (typeof columns)[number]["id"];

function KanbanCard({ task, columnId }: { task: TaskWithMeta; columnId: ColumnId }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
    data: { columnId },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="rounded-2xl border border-steel bg-white p-4 shadow-card">
      <p className="text-sm text-ink">{task.title}</p>
      <p className="mt-1 text-xs text-mist">Client name: {task.clientName ?? "Unassigned"}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-mist">
        <PriorityBadge priority={task.priority} />
        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</span>
      </div>
    </div>
  );
}

function KanbanColumn({
  column,
  tasks,
  children,
}: {
  column: { id: ColumnId; title: string };
  tasks: TaskWithMeta[];
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });
  return (
    <div ref={setNodeRef} className="min-w-[260px] flex-1 rounded-2xl border border-steel bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-ink">{column.title}</p>
        <span className="text-xs text-mist">{tasks.length}</span>
      </div>
      {children}
    </div>
  );
}

export function KanbanBoard({
  tasks,
  onStatusChange,
}: {
  tasks: TaskWithMeta[];
  onStatusChange: (taskId: string, status: TaskWithMeta["status"]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const grouped: Record<ColumnId, TaskWithMeta[]> = {
    open: tasks.filter((task) => task.status === "open" || task.status === "blocked"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    done: tasks.filter((task) => task.status === "done"),
  };

  const activeTask = tasks.find((task) => task._id === activeId) ?? null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeTaskId = String(active.id);
    const overColumn =
      (over.data.current?.columnId as ColumnId | undefined) ?? (over.id as ColumnId);
    if (!overColumn) return;
    onStatusChange(activeTaskId, overColumn);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} tasks={grouped[column.id]}>
            <SortableContext items={grouped[column.id].map((task) => task._id)} strategy={rectSortingStrategy}>
              <div className="mt-4 space-y-3">
                {grouped[column.id].map((task) => (
                  <KanbanCard key={task._id} task={task} columnId={column.id} />
                ))}
              </div>
            </SortableContext>
          </KanbanColumn>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rounded-2xl border border-steel bg-white p-4 shadow-card">
            <p className="text-sm text-ink">{activeTask.title}</p>
            <p className="mt-1 text-xs text-mist">Client name: {activeTask.clientName ?? "Unassigned"}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-mist">
              <PriorityBadge priority={activeTask.priority} />
              <span>Due: {activeTask.dueDate ? new Date(activeTask.dueDate).toLocaleDateString() : "-"}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
