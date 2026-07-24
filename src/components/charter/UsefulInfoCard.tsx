import { ArrowUpRight, Download, Link2 } from "lucide-react";
import { BrandIcon } from "@/components/brand/BrandIcon";
import type { PortalUsefulInfoItem } from "@/lib/types/portal";

/**
 * One useful-information tile on the client portal. A document tile downloads
 * the file (302 through the proxy); a link tile opens the URL in a new tab.
 */
export function UsefulInfoCard({ item }: { item: PortalUsefulInfoItem }) {
  const isDocument = item.type === "document" && item.document !== null;
  const href = isDocument ? item.document!.downloadUrl : (item.url ?? "#");
  const subtitle = isDocument ? (item.document!.originalFileName ?? "Document") : "Open link";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-portal-blue/25 bg-portal-blue/5 text-portal-blue">
        {isDocument ? (
          <BrandIcon name="generic_document" className="h-6 w-6" />
        ) : (
          <Link2 className="h-5 w-5" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-[14px] font-bold uppercase tracking-[0.06em] text-[#013b93]">
          {item.name}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-[#013b93]/60">{subtitle}</span>
      </span>

      {isDocument ? (
        <Download className="h-5 w-5 shrink-0 text-brand-ink/30 transition-colors group-hover:text-portal-blue" />
      ) : (
        <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-ink/30 transition-all group-hover:translate-x-0.5 group-hover:text-portal-blue" />
      )}
    </a>
  );
}
