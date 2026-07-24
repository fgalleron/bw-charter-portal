"use client";

import { use } from "react";
import Link from "next/link";
import useSWR from "swr";
import { ArrowLeft, Info, Loader2 } from "lucide-react";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { UsefulInfoCard } from "@/components/charter/UsefulInfoCard";
import { getCharter, getUsefulInformation } from "@/lib/api/portal";
import { cn } from "@/lib/utils/cn";

/**
 * Client-facing "Useful Information" page for a charter. Reuses the charter's
 * own destination photo as the hero (this is specific to the charter, not a
 * generic screen) and the back arrow returns to the charter page.
 */
export default function UsefulInformationPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = use(params);

  const { data: charter } = useSWR(["portal-charter", uuid], () => getCharter(uuid), {
    revalidateOnFocus: false,
  });
  const { data, isLoading, error } = useSWR(
    ["portal-useful-info", uuid],
    () => getUsefulInformation(uuid),
    { revalidateOnFocus: false },
  );

  const items = data?.items ?? [];

  return (
    <PortalChrome broker={charter?.broker ?? null} headerVariant="transparent">
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

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-portal-blue/90 via-portal-blue/60 to-portal-blue/20"
        />

        <div className="relative z-10 mx-auto flex min-h-[300px] max-w-[1500px] flex-col justify-end px-5 pb-8 pt-24 md:px-8 md:pt-28">
          <Link
            href={`/charters/${uuid}`}
            aria-label="Back to charter"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.06em] text-white md:text-4xl">
            Useful Informations
          </h1>
          <span aria-hidden="true" className="mt-3 block h-px w-12 bg-white/50" />

          {/* The charter name, so the client always knows which trip this is. */}
          {charter?.title && (
            <p className="mt-3 font-display text-lg font-semibold uppercase tracking-[0.16em] text-white/85 md:text-xl">
              {charter.title}
            </p>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------------- grid */}
      <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
        {isLoading && !data ? (
          <div className="flex items-center justify-center py-24 text-brand-ink/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <p className="rounded-xl bg-white p-6 text-sm text-brand-ink shadow-card">
            We could not load this information. Please try again in a moment.
          </p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-12 text-center shadow-card">
            <Info className="h-9 w-9 text-brand-ink/25" aria-hidden="true" />
            <p className="text-sm text-brand-ink">
              Your specialist will add useful information for this charter here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <UsefulInfoCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </PortalChrome>
  );
}
