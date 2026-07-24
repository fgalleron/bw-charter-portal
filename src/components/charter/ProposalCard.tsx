import { ArrowUpRight, CalendarDays, Ship } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCharterDates } from "@/lib/utils/format";
import type { PortalProposalCard } from "@/lib/types/portal";

/**
 * Proposal tile on the home screen. Same format as a charter card, but labelled
 * "Proposal" and opening the client's private proposal link in a new tab.
 */
export function ProposalCard({ proposal }: { proposal: PortalProposalCard }) {
  const dates = formatCharterDates(proposal.charterStartDate, proposal.charterEndDate);

  return (
    <a
      href={proposal.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-portal-navy">
        {proposal.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={proposal.photo.medium}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="portal-field flex h-full w-full items-center justify-center">
            <Ship className="h-10 w-10 text-white/35" aria-hidden="true" />
          </div>
        )}

        {/* Same pill treatment as StatusPill, labelled as a proposal. */}
        <span
          className={cn(
            "absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white bg-white/15 px-3 py-1.5 backdrop-blur-sm",
            "font-display text-[10px] font-bold uppercase tracking-[0.16em] text-white",
          )}
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-portal-bright" />
          Proposal
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-bold uppercase tracking-[0.06em] text-portal-blue">
          {proposal.title}
        </h3>
        <span aria-hidden="true" className="mt-2 block h-px w-10 bg-brand-hairline" />

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {dates && (
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.06em] text-brand-ink">
              <CalendarDays className="h-4 w-4 shrink-0 text-brand-ink/50" />
              {dates}
            </span>
          )}

          {/* Visual affordance only: the whole card is already the link. The
              up-right arrow hints that it opens in a new tab. */}
          <span
            className={cn(
              "ml-auto inline-flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.16em]",
              "text-slate-500 transition-colors group-hover:text-portal-blue",
            )}
          >
            View proposal
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-portal-blue transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </a>
  );
}
