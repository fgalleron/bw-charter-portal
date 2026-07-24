"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Home card row: a swipeable, snap-scrolling carousel with page dots on mobile,
 * that becomes a plain two-column grid from md up. Used for both the proposals
 * and the charters rows.
 */
export function CardCarousel({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;

    // Active card = the one whose left edge is closest to the scroll position.
    const cards = Array.from(track.children) as HTMLElement[];
    let closest = 0;
    let min = Infinity;
    cards.forEach((card, i) => {
      const distance = Math.abs(card.offsetLeft - track.scrollLeft);
      if (distance < min) {
        min = distance;
        closest = i;
      }
    });
    setActive(closest);
  }

  function scrollTo(index: number) {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (track && card) {
      track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }
  }

  return (
    <div className="mt-8">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className={cn(
          // Mobile: horizontal snap-scroll. Scrollbar hidden; vertical padding
          // keeps the card shadows from being clipped by the scroll container.
          "flex snap-x snap-mandatory gap-4 overflow-x-auto py-2",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          // Desktop: a plain two-column grid, no scrolling.
          "md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:py-0",
        )}
      >
        {items.map((item, i) => (
          <div key={i} className="w-[80%] shrink-0 snap-start md:w-auto">
            {item}
          </div>
        ))}
      </div>

      {/* Page dots: mobile only, one per card. */}
      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-2 md:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to card ${i + 1}`}
              aria-current={i === active}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === active ? "w-6 bg-portal-blue" : "w-2 bg-portal-navy/25",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
