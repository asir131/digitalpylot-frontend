"use client";

import { useTasks } from "@/lib/hooks/useTasks";
import { CalendarView } from "@/components/tasks/CalendarView";

export default function TasksCalendarPage() {
  const { tasks } = useTasks();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Calendar</h2>
        <p className="text-sm text-mist">Task deadlines in a monthly view.</p>
      </div>
      <CalendarView tasks={tasks} />
    </div>
  );
}
