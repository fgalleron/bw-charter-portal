"use client";

import { use, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { Stripes } from "@/components/brand/Stripes";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { DocumentCard } from "@/components/charter/DocumentCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getCharter, markDocumentSeen } from "@/lib/api/portal";
import { cn } from "@/lib/utils/cn";
import { formatCharterDates } from "@/lib/utils/format";
import type { CharterDocumentKey } from "@/lib/types/portal";

/** Documents shown per page before the carousel controls appear. */
const DOCUMENTS_PER_PAGE = 6;

export default function CharterDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = use(params);
  const [page, setPage] = useState(0);

  const { data: charter, isLoading, error, mutate } = useSWR(
    ["portal-charter", uuid],
    () => getCharter(uuid),
    { revalidateOnFocus: false },
  );

  // Opening a trackable document flips its tab to "seen": update the cache
  // immediately, then record it server-side.
  function handleOpenDocument(key: CharterDocumentKey) {
    if (key !== "itinerary" && key !== "charter_agreement") return;

    void mutate(
      (prev) =>
        prev
          ? {
              ...prev,
              documents: prev.documents.map((d) => (d.key === key ? { ...d, seen: true } : d)),
            }
          : prev,
      { revalidate: false },
    );
    void markDocumentSeen(uuid, key).catch(() => undefined);
  }

  const documents = charter?.documents ?? [];
  const pageCount = Math.ceil(documents.length / DOCUMENTS_PER_PAGE) || 1;
  const visibleDocuments = documents.slice(
    page * DOCUMENTS_PER_PAGE,
    page * DOCUMENTS_PER_PAGE + DOCUMENTS_PER_PAGE,
  );

  const dates = formatCharterDates(
    charter?.charterStartDate ?? null,
    charter?.charterEndDate ?? null,
  );

  return (
    <PortalChrome
      broker={charter?.broker ?? null}
      charterUuid={charter?.uuid ?? null}
      charterTitle={charter?.title ?? null}
      headerVariant="transparent"
    >
      {/* ------------------------------------------------------------- hero */}
      <section className="relative min-h-[300px] overflow-hidden bg-portal-navy">
        {charter?.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={charter.photo.large}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              charter.status === "completed" && "grayscale",
            )}
          />
        ) : (
          <div className="portal-field absolute inset-0" />
        )}

        {/* Scrim: a vivid blue wash that keeps the overlaid header and title
            legible while letting the photo show through on the right. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-portal-blue/90 via-portal-blue/60 to-portal-blue/20"
        />

        <div className="relative z-10 mx-auto flex min-h-[300px] max-w-[1500px] flex-col justify-end px-5 pb-8 pt-24 md:px-8 md:pt-28">
          {isLoading && !charter ? (
            <Loader2 className="h-6 w-6 animate-spin text-white/70" />
          ) : error || !charter ? (
            <div className="text-white">
              <p className="text-sm">This charter is not available.</p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.16em] underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to my charters
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  aria-label="Back to my charters"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <StatusPill status={charter.status} />
              </div>

              <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.06em] text-white md:text-4xl">
                {charter.title}
              </h1>
              <span aria-hidden="true" className="mt-3 block h-px w-12 bg-white/50" />

              <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
                {dates && (
                  <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-white/90">
                    <CalendarDays className="h-4 w-4 text-white/60" />
                    {dates}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-white/90">
                  <BrandIcon name="generic_document" className="h-4 w-4 text-white/60" />
                  {charter.documentsCount} document{charter.documentsCount === 1 ? "" : "s"}
                </span>

                {/* Not wired yet: kept visible so the layout matches the design.
                    Same height (py-3.5); widths follow their own content. */}
                <span className="ml-auto flex items-center gap-3">
                  <button
                    type="button"
                    disabled
                    title="Coming soon"
                    className="inline-flex h-12 cursor-not-allowed items-center gap-2 rounded-md border-2 border-white/70 px-6 font-display text-xs font-bold uppercase tracking-[0.16em] text-white"
                  >
                    Share
                    <BrandIcon name="share" className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Coming soon"
                    className="hidden h-12 cursor-not-allowed items-center gap-2 rounded-md bg-white/90 px-6 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-portal-navy/70 sm:inline-flex"
                  >
                    <BrandIcon name="charter_calendar" className="h-4 w-4" />
                    Charter calendar
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------- documents */}
      {charter && (
        <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-[#013b93] md:text-base">
              Your documents
            </h2>

            {pageCount > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  aria-label="Previous documents"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-hairline text-portal-navy transition-colors hover:bg-white disabled:opacity-35"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={page >= pageCount - 1}
                  aria-label="Next documents"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-hairline text-portal-navy transition-colors hover:bg-white disabled:opacity-35"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleDocuments.map((document) => (
              <DocumentCard
                key={document.key}
                document={document}
                onOpen={() => handleOpenDocument(document.key)}
              />
            ))}
          </div>

          {/* Set apart from the document cards: entry point to the charter's
              useful-information page. Placeholder gradient field until a real
              photo is wired in. */}
          <Link
            href={`/charters/${uuid}/useful-information`}
            className="portal-field group mt-10 flex h-[180px] items-end rounded-2xl shadow-card transition-shadow hover:shadow-card-hover"
          >
            <Stripes className="opacity-70" />
            <div className="relative z-10 flex w-full items-center justify-between gap-4 px-7 pb-7">
              <span className="font-display text-2xl font-bold uppercase tracking-[0.1em] text-white md:text-3xl">
                Useful informations
              </span>
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/60 text-white transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </Link>
        </section>
      )}
    </PortalChrome>
  );
}
