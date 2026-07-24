import { cn } from "@/lib/utils/cn";

/**
 * Bluewater line icons served from /public.
 *
 * The source files carry no fill attribute, so rendering them through an <img>
 * would paint them black on every background. They are drawn as a CSS mask
 * instead, which lets the glyph take the current text colour and work on both
 * the dark hero and the light document cards.
 */
export const BRAND_ICONS = {
  yacht_selection: "/icon_yacht_selection.svg",
  preference_list: "/icon_preference_list.svg",
  generic_document: "/icon_generic_document.svg",
  itinerary: "/icon_itinerary.svg",
  share: "/icon_share.svg",
  charter_calendar: "/icon_charter_calendar.svg",
} as const;

export type BrandIconName = keyof typeof BRAND_ICONS;

export function BrandIcon({
  name,
  className,
}: {
  name: BrandIconName;
  className?: string;
}) {
  const src = BRAND_ICONS[name];

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
