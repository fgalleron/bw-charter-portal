import { cn } from "@/lib/utils/cn";

/**
 * The vertical stripe artwork that dresses the deep-blue fields.
 *
 * Two layouts:
 *   - "edge" (default): the header band, pinned to the right edge at its
 *     natural aspect. Used in the header, menus and small panels.
 *   - "fill": a right-anchored band for the sign-in screen. The footer artwork
 *     carries its stripes on the right half, so we show that half only
 *     (background-size 200%, positioned right) inside a band whose width tightens
 *     on smaller screens. This keeps the stripes hugging the right edge instead
 *     of spreading toward the centre.
 *
 * Decorative only: hidden from assistive tech and never intercepts clicks.
 */
export function Stripes({
  src = "/stripes_header_desktop.avif",
  variant = "edge",
  className,
}: {
  src?: string;
  variant?: "edge" | "fill";
  className?: string;
}) {
  if (variant === "fill") {
    return (
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "200% 100%",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 h-full select-none opacity-90",
          // Tighter to the right on small screens, a touch wider on desktop.
          "w-[24%] sm:w-[28%] lg:w-[32%]",
          className,
        )}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 right-0 h-full w-auto select-none object-cover opacity-90",
        className,
      )}
    />
  );
}
