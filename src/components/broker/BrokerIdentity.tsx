import { BrokerAvatar } from "@/components/broker/BrokerAvatar";
import { cn } from "@/lib/utils/cn";
import { fullName } from "@/lib/utils/format";
import type { PortalBroker } from "@/lib/types/portal";

/** Shown when a broker has no job title recorded (no such column yet). */
export const DEFAULT_BROKER_TITLE = "Yacht Sales & Charter Specialist";

const AVATAR_GAPS = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
} as const;

export function BrokerIdentity({
  broker,
  avatarSize = 44,
  align = "right",
  avatarSide = "left",
  avatarGap = "sm",
  className,
}: {
  broker: PortalBroker;
  avatarSize?: number;
  align?: "left" | "right";
  /** Side the photo sits on; the name and title take the other side. */
  avatarSide?: "left" | "right";
  /** Spacing between the photo and the name block. */
  avatarGap?: keyof typeof AVATAR_GAPS;
  className?: string;
}) {
  const avatar = <BrokerAvatar broker={broker} size={avatarSize} />;
  const details = (
    <span className={cn("flex flex-col", align === "right" ? "text-right" : "text-left")}>
      <span className="font-display text-sm font-bold uppercase tracking-[0.06em] text-white">
        {fullName(broker.firstName, broker.lastName)}
      </span>
      <span className="text-[10px] uppercase tracking-[0.04em] text-white/70">
        {broker.title ?? DEFAULT_BROKER_TITLE}
      </span>
    </span>
  );

  return (
    <span className={cn("inline-flex items-center", AVATAR_GAPS[avatarGap], className)}>
      {avatarSide === "right" ? (
        <>
          {details}
          {avatar}
        </>
      ) : (
        <>
          {avatar}
          {details}
        </>
      )}
    </span>
  );
}
