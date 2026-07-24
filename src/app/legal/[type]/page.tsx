"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { getLegalDocument } from "@/lib/api/portal";
import { sanitizeRichText } from "@/lib/utils/safeRichText";

const TYPES = ["terms", "privacy"] as const;
type LegalType = (typeof TYPES)[number];

function isLegalType(value: string): value is LegalType {
  return (TYPES as readonly string[]).includes(value);
}

/**
 * Public, versioned legal document. Reachable without a session so the sign-in
 * screen and the acceptance gate can both link to it.
 */
export default function LegalPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  if (!isLegalType(type)) notFound();

  const { data, isLoading, error } = useSWR(["portal-legal", type], () => getLegalDocument(type), {
    revalidateOnFocus: false,
  });

  const publishedAt = data?.publishedAt
    ? new Date(data.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-portal-mist">
      <header className="bg-portal-deep">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 px-5 py-5 md:px-8">
          <Logo href="/" />
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[900px] px-5 py-10 md:px-8 md:py-14">
        {isLoading && !data ? (
          <div className="flex justify-center py-24 text-brand-ink/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error || !data ? (
          <div className="rounded-2xl bg-white p-8 shadow-card">
            <p className="text-sm text-brand-ink">
              This document is not available yet. Please contact your Bluewater specialist.
            </p>
          </div>
        ) : (
          <article className="rounded-2xl bg-white p-6 shadow-card md:p-10">
            <h1 className="font-display text-2xl font-bold uppercase tracking-[0.06em] text-portal-navy md:text-3xl">
              {data.title}
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-brand-ink/50">
              Version {data.version}
              {publishedAt ? ` · ${publishedAt}` : ""}
            </p>
            <span aria-hidden="true" className="mt-6 block h-px w-full bg-brand-hairline" />

            <div
              className="legal-prose mt-6"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(data.content) }}
            />
          </article>
        )}
      </div>
    </main>
  );
}
