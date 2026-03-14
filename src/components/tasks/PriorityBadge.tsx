import clsx from "clsx";

const toneMap: Record<string, string> = {
  urgent: "bg-[#FFEEE9] text-[#E63F2C] border-[#FFD1C7]",
  high: "bg-[#FFEFE6] text-[#FF7A3D] border-[#FFD5C2]",
  medium: "bg-[#FFF4E0] text-[#F29F1D] border-[#FFE2B3]",
  low: "bg-[#EAF8EF] text-[#2E9B57] border-[#CFEAD9]",
};

export function PriorityBadge({ priority }: { priority: string }) {
  const key = priority.toLowerCase();
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
        toneMap[key] ?? "bg-cream text-cocoa border-steel"
      )}
    >
      {priority[0].toUpperCase() + priority.slice(1)}
    </span>
  );
}
