"use client";

import { BrokerIdentity } from "@/components/broker/BrokerIdentity";
import { Stripes } from "@/components/brand/Stripes";
import { cn } from "@/lib/utils/cn";
import type { PortalBroker } from "@/lib/types/portal";

/**
 * Mobile-only sticky bar pinning the client's specialist to the bottom of the
 * screen, with the Get in touch action. On desktop the same information lives
 * in the header instead.
 */
export function BrokerBar({
  broker,
  onGetInTouch,
}: {
  broker: PortalBroker | null;
  onGetInTouch: () => void;
}) {
  if (!broker) return null;

  return (
    <div className="sticky bottom-0 z-40 px-3 pb-3 md:hidden">
      <div className="portal-field relative flex items-center gap-3 rounded-xl px-4 py-3 shadow-card-hover">
        <Stripes className="rounded-xl opacity-50" />
        <div className="relative z-10 flex w-full items-center gap-3">
          <BrokerIdentity broker={broker} align="left" avatarSize={40} className="min-w-0 flex-1" />
          <button
            type="button"
            onClick={onGetInTouch}
            className={cn(
              "shrink-0 rounded-md border border-white/60 px-3.5 py-2",
              "font-display text-[10px] font-bold uppercase tracking-[0.14em] text-white",
              "transition-colors hover:bg-white/10",
            )}
          >
            Get in touch
          </button>
        </div>
      </div>
    </div>
  );
}
