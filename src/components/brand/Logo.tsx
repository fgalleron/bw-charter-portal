import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * The Bluewater "Private Client Space" lockup. The wordmark and the tagline
 * both live inside the SVG, so nothing is composed here.
 *
 * The source file shipped with a 1042x500 viewBox around artwork only 900x264
 * wide, which padded the logo with transparent space and inflated the header.
 * Its viewBox is tightened to the ink bounds; the paths are untouched, so a
 * re-export from the design tool needs the same one-attribute fix.
 */
const LOGO_HEIGHTS = {
  default: "h-9",
  md: "h-11",
  large: "h-14",
} as const;

export function Logo({
  href = "/",
  className,
  size = "default",
}: {
  href?: string | null;
  className?: string;
  size?: keyof typeof LOGO_HEIGHTS;
}) {
  const content = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo_bw_private_client_space.svg"
      alt="Bluewater Private Client Space"
      className={cn("w-auto", LOGO_HEIGHTS[size], className)}
    />
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex shrink-0 transition-opacity hover:opacity-90">
      {content}
    </Link>
  );
}
