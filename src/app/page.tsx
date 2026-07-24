"use client";

import useSWR from "swr";
import { Loader2, Ship } from "lucide-react";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { CharterCard } from "@/components/charter/CharterCard";
import { ProposalCard } from "@/components/charter/ProposalCard";
import { CardCarousel } from "@/components/charter/CardCarousel";
import { listCharters } from "@/lib/api/portal";

/**
 * Horizontal frame shared by the header and the cards, so both line up on the
 * same left and right edges (the right 15% is left free for the hero stripes).
 */
const CONTENT_X = "mx-auto w-full max-w-[1800px] px-5 md:px-0 md:pl-[6%] md:pr-[15%]";

/**
 * Home: the client's charters.
 *
 * A deep-blue hero band tops the page; the charter cards straddle its lower
 * edge, half over the blue and half over the light surface below. The header
 * floats transparently over that same band, so the whole top reads as one field.
 *
 * The specialist shown in the header is the account broker returned by the API
 * (owner of the most recent active charter), and Get in touch attaches its
 * message to that same charter.
 */
export default function HomePage() {
  const { data, isLoading, error } = useSWR("portal-charters", listCharters, {
    revalidateOnFocus: false,
  });

  const charters = data?.charters ?? [];
  const proposals = data?.proposals ?? [];
  const activeCharter = charters.find((c) => c.status === "active") ?? charters[0] ?? null;

  return (
    <PortalChrome
      broker={data?.accountBroker ?? null}
      charterUuid={activeCharter?.uuid ?? null}
      charterTitle={activeCharter?.title ?? null}
      headerVariant="transparent"
      headerContainerClassName={`flex items-center gap-3 py-4 ${CONTENT_X}`}
      showWelcome
    >
      <div className="relative">
        {/* Full-width blue hero band. The cards below overlap its lower edge. */}
        <div
          aria-hidden="true"
          className="portal-field absolute inset-x-0 top-0 h-[42vh] min-h-[340px] overflow-hidden"
        >
          {/* Stripes fill the column to the right of the content, beginning at
              its edge. Same max width and right reserve as the content below. */}
          <div className="mx-auto h-full max-w-[1800px]">
            <div
              className="ml-auto h-full w-[15%] bg-[url('/stripes_footer.png')] bg-[length:auto_100%] bg-right bg-no-repeat opacity-90"
            />
          </div>
        </div>

        <div className={`relative pb-16 pt-28 md:pt-32 ${CONTENT_X}`}>
          {/* Shared, still-live proposals sit above the charters. */}
          {proposals.length > 0 && (
            <section className="mb-14">
              <h2 className="font-display text-xl font-bold uppercase tracking-[0.1em] text-white md:text-2xl">
                Your proposals
              </h2>
              <CardCarousel>
                {proposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </CardCarousel>
            </section>
          )}

          {/* White over the blue band when it sits at the top; dark once the
              proposals section has pushed it down onto the light surface. */}
          <h2
            className={`font-display text-xl font-bold uppercase tracking-[0.1em] md:text-2xl ${
              proposals.length > 0 ? "text-portal-navy" : "text-white"
            }`}
          >
            Your charters
          </h2>

          {isLoading && !data ? (
            <div className="mt-8 flex items-center justify-center py-24 text-white/70">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <p className="mt-8 rounded-xl bg-white p-6 text-sm text-brand-ink shadow-card">
              We could not load your charters. Please try again in a moment.
            </p>
          ) : charters.length === 0 ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-xl bg-white p-12 text-center shadow-card">
              <Ship className="h-9 w-9 text-brand-ink/25" aria-hidden="true" />
              <p className="text-sm text-brand-ink">
                Your charters will appear here as soon as your specialist sets them up.
              </p>
            </div>
          ) : (
            <CardCarousel>
              {charters.map((charter) => (
                <CharterCard key={charter.uuid} charter={charter} />
              ))}
            </CardCarousel>
          )}
        </div>
      </div>
    </PortalChrome>
  );
}
