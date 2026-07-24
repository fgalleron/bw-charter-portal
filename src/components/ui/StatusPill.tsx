import { cn } from "@/lib/utils/cn";
import { CHARTER_STATUS_LABELS, type CharterStatus } from "@/lib/types/portal";

/**
 * Charter state badge: a coloured dot plus the label, on a translucent dark
 * pill so it stays legible over any photo.
 */
export function StatusPill({
  status,
  className,
}: {
  status: CharterStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white bg-white/15 px-3 py-1.5 backdrop-blur-sm",
        "font-display text-[10px] font-bold uppercase tracking-[0.16em] text-white",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 rounded-full",
          status === "active" && "bg-status-active",
          status === "completed" && "bg-status-completed",
          status === "cancelled" && "bg-white/50",
        )}
      />
      {CHARTER_STATUS_LABELS[status]}
    </span>
  );
}
