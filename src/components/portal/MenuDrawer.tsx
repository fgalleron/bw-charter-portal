"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, FileText, Home, LogOut, Ship, Shield, ScrollText, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Stripes } from "@/components/brand/Stripes";
import { logout } from "@/lib/api/portal";
import { cn } from "@/lib/utils/cn";

interface MenuEntry {
  label: string;
  href?: string;
  icon: typeof Home;
  /** Sections whose pages are not built yet stay visible but inert. */
  disabled?: boolean;
}

const ENTRIES: MenuEntry[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Charters", href: "/", icon: Ship },
  { label: "Calendar", icon: CalendarDays, disabled: true },
  { label: "Documents", icon: FileText, disabled: true },
  { label: "Terms & Conditions", href: "/legal/terms", icon: ScrollText },
  { label: "Privacy Policy", href: "/legal/privacy", icon: Shield },
];

export function MenuDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleLogout() {
    try {
      await logout();
    } finally {
      // Even if the call fails the cookie may be gone: send them to sign-in.
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-portal-deep/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onClick={onClose}
    >
      <aside
        className="portal-field animate-drawer-in absolute inset-y-0 right-0 flex w-full max-w-sm flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <Stripes className="opacity-40" />

        <div className="relative z-10 flex items-start justify-between p-6">
          <Logo href={null} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full border border-white/25 p-2 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="relative z-10 flex-1 overflow-y-auto px-6 py-4">
          <ul className="space-y-1">
            {ENTRIES.map((entry) => {
              const Icon = entry.icon;

              if (entry.disabled || !entry.href) {
                return (
                  <li key={entry.label}>
                    <span
                      aria-disabled="true"
                      className="flex cursor-not-allowed items-center justify-between gap-3 rounded-lg px-3 py-3 text-white/40"
                    >
                      <span className="inline-flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span className="font-display text-[13px] uppercase tracking-[0.14em]">
                          {entry.label}
                        </span>
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.12em]">Soon</span>
                    </span>
                  </li>
                );
              }

              return (
                <li key={entry.label}>
                  <Link
                    href={entry.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-white/85",
                      "transition-colors hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-display text-[13px] uppercase tracking-[0.14em]">
                      {entry.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative z-10 border-t border-white/15 p-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-display text-[13px] uppercase tracking-[0.14em]">Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
