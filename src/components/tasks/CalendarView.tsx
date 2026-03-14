import type { TaskWithMeta } from "@/lib/hooks/useTasks";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function CalendarView({ tasks }: { tasks: TaskWithMeta[] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);

  const days: Array<{ date: Date | null; tasks: TaskWithMeta[] }> = [];
  for (let i = 0; i < firstDay; i += 1) {
    days.push({ date: null, tasks: [] });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dayTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      return due.getFullYear() === year && due.getMonth() === month && due.getDate() === day;
    });
    days.push({ date, tasks: dayTasks });
  }

  return (
    <div className="rounded-2xl border border-steel bg-white p-4">
      <div className="grid grid-cols-7 gap-2 text-xs text-mist">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
          <div key={label} className="py-2 text-center">
            {label}
          </div>
        ))}
        {days.map((day, index) => (
          <div key={`${day.date?.toISOString() ?? "empty"}-${index}`} className="min-h-[90px] rounded-xl border border-steel/60 p-2">
            <div className="text-xs text-mist">{day.date ? day.date.getDate() : ""}</div>
            <div className="mt-2 space-y-1">
              {day.tasks.slice(0, 2).map((task) => (
                <div key={task._id} className="truncate rounded-lg bg-cream px-2 py-1 text-[10px] text-cocoa">
                  {task.title}
                </div>
              ))}
              {day.tasks.length > 2 && (
                <div className="text-[10px] text-mist">+{day.tasks.length - 2} more</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
