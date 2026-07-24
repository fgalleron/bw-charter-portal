"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { initials } from "@/lib/utils/format";
import type { PortalBroker } from "@/lib/types/portal";

/**
 * Broker photo with an initials fallback.
 *
 * The photo is a presigned S3 URL: it can legitimately expire or be missing
 * entirely (many brokers have no approved picture), so initials are a
 * first-class state rather than an error state, and an onError swap covers a
 * stale presign returning 403.
 */
export function BrokerAvatar({
  broker,
  size = 44,
  className,
}: {
  broker: PortalBroker;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(broker.photoUrl) && !failed;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-white/15 ring-1 ring-white/30",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={broker.photoUrl as string}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="font-display font-bold uppercase text-white"
          style={{ fontSize: Math.max(11, Math.round(size * 0.34)) }}
        >
          {initials(broker.firstName, broker.lastName)}
        </span>
      )}
    </span>
  );
}
