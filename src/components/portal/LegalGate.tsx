"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Stripes } from "@/components/brand/Stripes";
import { acceptLegalDocuments } from "@/lib/api/portal";
import { cn } from "@/lib/utils/cn";
import type { PendingLegalDocument } from "@/lib/types/portal";

/**
 * Blocking acceptance screen shown when the client has not agreed to the
 * current version of a legal document.
 *
 * Publishing a new version in the intranet re-arms this automatically, so the
 * screen can reappear later with the updated wording.
 */
export function LegalGate({
  documents,
  onAccepted,
}: {
  documents: PendingLegalDocument[];
  onAccepted: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setSaving(true);
    setError(null);
    try {
      await acceptLegalDocuments(documents.map((d) => d.id));
      onAccepted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not record your acceptance.");
      setSaving(false);
    }
  }

  return (
    <div className="portal-field fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-5">
      <Stripes className="opacity-60" />

      <div className="relative z-10 w-full max-w-lg py-10">
        <div className="mb-8 flex justify-center">
          <Logo href={null} size="large" />
        </div>

        <div className="rounded-2xl bg-white p-7 shadow-card-hover">
          <h1 className="font-display text-xl font-bold uppercase tracking-[0.08em] text-portal-navy">
            Before you continue
          </h1>
          <p className="mt-3 text-sm text-brand-ink">
            {documents.length > 1
              ? "Please review and accept the documents below to access your space."
              : "Please review and accept the document below to access your space."}
          </p>

          <ul className="mt-5 space-y-2">
            {documents.map((document) => (
              <li key={document.id}>
                <Link
                  href={`/legal/${document.type}`}
                  target="_blank"
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border border-brand-hairline px-4 py-3",
                    "text-sm text-portal-navy transition-colors hover:border-portal-blue hover:text-portal-blue",
                  )}
                >
                  <span>
                    {document.title}
                    <span className="ml-2 text-xs text-brand-ink/60">v{document.version}</span>
                  </span>
                  <ExternalLink className="h-4 w-4 shrink-0 opacity-60" />
                </Link>
              </li>
            ))}
          </ul>

          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-brand-ink">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-portal-navy"
            />
            <span>
              I have read and agree to the{" "}
              {documents.map((d, index) => (
                <span key={d.id}>
                  {index > 0 && (index === documents.length - 1 ? " and " : ", ")}
                  <span className="font-semibold text-portal-navy">{d.title}</span>
                </span>
              ))}
              .
            </span>
          </label>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleAccept}
            disabled={!agreed || saving}
            className={cn(
              "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5",
              "font-display text-[12px] font-bold uppercase tracking-[0.16em] text-white",
              "bg-portal-navy transition-colors hover:bg-portal-blue",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Accept and continue
          </button>
        </div>
      </div>
    </div>
  );
}
