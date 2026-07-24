import Link from "next/link";
import { CalendarDays, FileText, MoveRight, Ship } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/utils/cn";
import { formatCharterDates } from "@/lib/utils/format";
import type { CharterCard as CharterCardData } from "@/lib/types/portal";

/**
 * Charter tile on the home screen. A completed charter is desaturated, as in
 * the mockups, so the active one reads first.
 */
export function CharterCard({ charter }: { charter: CharterCardData }) {
  const dates = formatCharterDates(charter.charterStartDate, charter.charterEndDate);
  const isCompleted = charter.status === "completed";

  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-[16/10] overflow-hidden bg-portal-navy">
        {charter.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={charter.photo.medium}
            alt=""
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
              isCompleted && "grayscale",
            )}
          />
        ) : (
          <div className="portal-field flex h-full w-full items-center justify-center">
            <Ship className="h-10 w-10 text-white/35" aria-hidden="true" />
          </div>
        )}

        <StatusPill status={charter.status} className="absolute left-4 top-4" />
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-bold uppercase tracking-[0.06em] text-portal-blue">
          {charter.title}
        </h3>
        <span aria-hidden="true" className="mt-2 block h-px w-10 bg-brand-hairline" />

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {dates && (
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.06em] text-brand-ink">
              <CalendarDays className="h-4 w-4 shrink-0 text-brand-ink/50" />
              {dates}
            </span>
          )}

          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.06em] text-brand-ink">
            <FileText className="h-4 w-4 shrink-0 text-brand-ink/50" />
            {charter.documentsCount} document{charter.documentsCount === 1 ? "" : "s"}
          </span>

          <Link
            href={`/charters/${charter.uuid}`}
            className={cn(
              "ml-auto inline-flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.16em]",
              "text-slate-500 transition-colors hover:text-portal-blue",
            )}
          >
            View charter
            <MoveRight
              className="h-4 w-9 shrink-0 text-portal-blue transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
