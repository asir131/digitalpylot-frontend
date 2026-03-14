"use client";

import { Modal } from "@/components/ui/Modal";
import type { TaskWithMeta } from "@/lib/hooks/useTasks";
import { PriorityBadge } from "./PriorityBadge";

export function TaskModal({
  task,
  open,
  onClose,
}: {
  task: TaskWithMeta | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!task) return null;
  return (
    <Modal open={open} title="Task details" onClose={onClose}>
      <div className="space-y-3 text-sm text-mist">
        <div>
          <p className="text-xs text-mist">Title</p>
          <p className="text-base text-ink">{task.title}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-mist">Client name</p>
            <p className="text-ink">{task.clientName ?? "Unassigned"}</p>
          </div>
          <div>
            <p className="text-xs text-mist">Status</p>
            <p className="text-ink">{task.status}</p>
          </div>
          <div>
            <p className="text-xs text-mist">Priority</p>
            <PriorityBadge priority={task.priority} />
          </div>
          <div>
            <p className="text-xs text-mist">Due date</p>
            <p className="text-ink">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
