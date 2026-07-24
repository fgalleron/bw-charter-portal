"use client";

import { Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Stripes } from "@/components/brand/Stripes";
import { BrokerIdentity } from "@/components/broker/BrokerIdentity";
import { cn } from "@/lib/utils/cn";
import type { PortalBroker } from "@/lib/types/portal";

/**
 * Top bar of the portal.
 *
 * `solid` draws its own deep-blue field (home); `transparent` lets the charter
 * hero photo show through underneath. The broker block and the Get in touch
 * button are desktop-only: on mobile they live in the sticky bottom bar, as in
 * the mockups.
 */
/** Default inner container; the home overrides it to line up with its cards. */
const DEFAULT_HEADER_CONTAINER =
  "mx-auto flex max-w-[1500px] items-center gap-3 px-5 py-4 md:px-8";

export function Header({
  broker,
  welcomeName,
  variant = "solid",
  containerClassName = DEFAULT_HEADER_CONTAINER,
  onOpenMenu,
  onGetInTouch,
}: {
  broker: PortalBroker | null;
  welcomeName?: string | null;
  variant?: "solid" | "transparent";
  /** Inner container classes, so the header can share the content's width. */
  containerClassName?: string;
  onOpenMenu: () => void;
  onGetInTouch: () => void;
}) {
  return (
    <header
      className={cn(
        "relative z-30",
        variant === "solid" ? "portal-field" : "bg-transparent",
      )}
    >
      {/* Desktop: the solid header carries the stripe artwork (transparent
          pages dress the hero band itself). Mobile: a tighter stripe band sits
          on the right of every header. */}
      {variant === "solid" && <Stripes className="hidden md:block" />}
      <Stripes
        src="/stripes_header.png"
        className="w-[32%] max-w-[130px] object-fill opacity-90 md:hidden"
      />

      <div className={cn("relative z-10", containerClassName)}>
        <Logo size="md" />

        {welcomeName && (
          <>
            <span aria-hidden="true" className="hidden h-6 w-px bg-white/20 md:block" />
            <p className="hidden text-xl font-light tracking-tight text-white/95 md:block md:text-2xl">
              Welcome back {welcomeName}
            </p>
          </>
        )}

        <div className="ml-auto flex items-center gap-4 md:gap-6">
          {broker && (
            <BrokerIdentity
              broker={broker}
              align="left"
              avatarSide="left"
              avatarGap="lg"
              className="hidden lg:inline-flex lg:mr-6"
            />
          )}

          <button
            type="button"
            onClick={onGetInTouch}
            className={cn(
              "hidden rounded-md border-2 border-white/70 px-5 py-2.5 md:inline-flex",
              "font-display text-[11px] font-bold uppercase tracking-[0.1em] text-white",
              "transition-colors hover:border-white hover:bg-white/10",
            )}
          >
            Get in touch
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full",
              "border-[1.5px] border-white text-white transition-colors hover:bg-white/10",
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
