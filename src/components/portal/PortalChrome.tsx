"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Header } from "@/components/portal/Header";
import { BrokerBar } from "@/components/portal/BrokerBar";
import { MenuDrawer } from "@/components/portal/MenuDrawer";
import { GetInTouchModal } from "@/components/portal/GetInTouchModal";
import { LegalGate } from "@/components/portal/LegalGate";
import { getMe } from "@/lib/api/portal";
import { ApiError } from "@/lib/api/client";
import type { PortalBroker } from "@/lib/types/portal";

/**
 * Shared chrome of every signed-in page: header, menu, specialist bar and the
 * Get in touch panel, plus the blocking legal-acceptance screen.
 *
 * The broker and the charter the message attaches to are passed in by the page,
 * because the home shows the account broker while a charter page shows the
 * broker owning that charter.
 */
export function PortalChrome({
  broker,
  charterUuid = null,
  charterTitle = null,
  headerVariant = "solid",
  headerContainerClassName,
  showWelcome = false,
  children,
}: {
  broker: PortalBroker | null;
  charterUuid?: string | null;
  charterTitle?: string | null;
  headerVariant?: "solid" | "transparent";
  /** Passed through so a page can align the header with its own content width. */
  headerContainerClassName?: string;
  showWelcome?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const { data: me, mutate } = useSWR("portal-me", getMe, {
    revalidateOnFocus: false,
    onError: (error) => {
      // The session died server-side: bounce to the sign-in screen.
      if (error instanceof ApiError && error.status === 401) {
        router.replace("/login");
      }
    },
  });

  const pendingLegal = me?.pendingLegalDocuments ?? [];

  return (
    <>
      {pendingLegal.length > 0 && (
        <LegalGate documents={pendingLegal} onAccepted={() => void mutate()} />
      )}

      <div className="relative flex min-h-screen flex-col">
        {/* Transparent variant floats over the charter hero photo. */}
        <div className={headerVariant === "transparent" ? "absolute inset-x-0 top-0 z-30" : undefined}>
          <Header
            broker={broker}
            welcomeName={showWelcome ? me?.firstName : null}
            variant={headerVariant}
            containerClassName={headerContainerClassName}
            onOpenMenu={() => setMenuOpen(true)}
            onGetInTouch={() => setContactOpen(true)}
          />
        </div>

        <main className="flex-1">{children}</main>

        <BrokerBar broker={broker} onGetInTouch={() => setContactOpen(true)} />
      </div>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <GetInTouchModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        broker={broker}
        charterUuid={charterUuid}
        charterTitle={charterTitle}
      />
    </>
  );
}
