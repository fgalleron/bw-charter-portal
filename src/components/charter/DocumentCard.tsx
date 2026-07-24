import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand/BrandIcon";
import { cn } from "@/lib/utils/cn";
import { formatUpdated } from "@/lib/utils/format";
import type { CharterDocument, CharterDocumentKey } from "@/lib/types/portal";

const ICONS: Record<CharterDocumentKey, BrandIconName> = {
  yacht_selection: "yacht_selection",
  itinerary: "itinerary",
  charter_agreement: "generic_document",
  preference_list: "preference_list",
};

/**
 * Seen / not-seen chip pinned to the top-right of trackable documents
 * (itinerary, agreement). Green once the client has seen the current revision,
 * soft blue while there is something new to look at.
 */
function SeenBadge({ seen }: { seen: boolean }) {
  return (
    <span
      className={cn(
        "absolute right-4 top-4 inline-flex items-center rounded-full px-2.5 py-1",
        "text-[10px] font-bold uppercase tracking-[0.12em]",
        seen ? "bg-[#dbf4e2] text-[#1f9d55]" : "bg-[#e5edfa] text-[#013b93]",
      )}
    >
      {seen ? "Seen" : "Not seen"}
    </span>
  );
}

/**
 * One document row. Rows that are not available yet stay visible but inert, so
 * the client can see what is still to come rather than wondering what is
 * missing.
 *
 * `onOpen` fires when a trackable document is opened, so the page can flip its
 * tab to "seen"; the link still navigates normally.
 */
export function DocumentCard({
  document,
  onOpen,
}: {
  document: CharterDocument;
  onOpen?: () => void;
}) {
  const iconName = ICONS[document.key] ?? "generic_document";
  const updated = formatUpdated(document.updatedAt);

  const subtitle =
    document.version !== null
      ? `Version ${document.version}${updated ? ` · Updated ${updated}` : ""}`
      : updated
        ? `Updated ${updated}`
        : document.available
          ? "Available"
          : "Coming soon";

  const inner = (
    <>
      <span
        className={cn(
          "inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2",
          document.available
            ? "border-portal-blue/30 bg-portal-blue/5 text-portal-blue"
            : "border-brand-hairline bg-brand-hairline/30 text-brand-ink/35",
        )}
      >
        <BrandIcon name={iconName} className="h-7 w-7" />
      </span>

      <span className="min-w-0 flex-1 pr-16">
        <span
          className={cn(
            "block font-display text-[13px] font-bold uppercase tracking-[0.1em]",
            document.available ? "text-[#013b93]" : "text-[#013b93]/50",
          )}
        >
          {document.label}
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[12px]",
            document.available ? "text-[#013b93]/70" : "text-[#013b93]/45",
          )}
        >
          {subtitle}
        </span>
      </span>

      {document.available && document.seen !== null && <SeenBadge seen={document.seen} />}
    </>
  );

  const baseClass = "relative flex items-center gap-4 rounded-xl bg-white p-5 shadow-card";

  if (!document.available || !document.url) {
    return (
      <div aria-disabled="true" className={cn(baseClass, "cursor-not-allowed opacity-70")}>
        {inner}
      </div>
    );
  }

  if (document.external) {
    return (
      <a
        href={document.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onOpen}
        className={cn(baseClass, "transition-shadow hover:shadow-card-hover")}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={document.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onOpen}
      className={cn(baseClass, "transition-shadow hover:shadow-card-hover")}
    >
      {inner}
    </Link>
  );
}
