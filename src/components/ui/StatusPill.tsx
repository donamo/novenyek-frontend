import { clsx } from "clsx";

const toneByStatus: Record<string, string> = {
  active: "bg-leaf-100 text-leaf-700",
  inactive: "bg-slate-100 text-slate-700",
  dead: "bg-red-100 text-red-700",
  gifted: "bg-sky-100 text-sky-700",
  good: "bg-leaf-100 text-leaf-700",
  medium: "bg-amber-100 text-amber-800",
  bad: "bg-red-100 text-red-700",
  unknown: "bg-slate-100 text-slate-700"
};

export function StatusPill({ value, label }: { value?: string | null; label?: string }) {
  const safeValue = value ?? "unknown";
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
        toneByStatus[safeValue] ?? toneByStatus.unknown
      )}
    >
      {label ?? safeValue}
    </span>
  );
}
