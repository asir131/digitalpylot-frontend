export function LoadingState({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-mist">
      <div className="h-3 w-3 animate-pulse rounded-full bg-citrus" />
      {label ?? "Loading..."}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="text-sm text-mist">{description}</p>
    </div>
  );
}
