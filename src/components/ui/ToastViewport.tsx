"use client";

import { useToast } from "@/context/ToastContext";
import clsx from "clsx";

export function ToastViewport() {
  const { toasts, remove } = useToast();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "card w-80 border border-white/10 p-4",
            toast.tone === "success" && "border-neon/60",
            toast.tone === "error" && "border-blush/60"
          )}
          onClick={() => remove(toast.id)}
        >
          <h4 className="font-display text-sm text-ink">{toast.title}</h4>
          {toast.description && <p className="text-xs text-mist">{toast.description}</p>}
        </div>
      ))}
    </div>
  );
}
