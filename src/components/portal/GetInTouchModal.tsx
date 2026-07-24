"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Mail, Phone, X } from "lucide-react";
import { BrokerIdentity } from "@/components/broker/BrokerIdentity";
import { sendCharterMessage } from "@/lib/api/portal";
import { cn } from "@/lib/utils/cn";
import type { PortalBroker } from "@/lib/types/portal";

/**
 * "Get in touch" panel. The message is attached to a charter and lands in the
 * broker's intranet notifications; the direct channels stay available for
 * anything urgent.
 *
 * With no charter to attach to (a client with no booking yet), the form is
 * omitted and only the direct channels are offered.
 */
export function GetInTouchModal({
  open,
  onClose,
  broker,
  charterUuid,
  charterTitle,
}: {
  open: boolean;
  onClose: () => void;
  broker: PortalBroker | null;
  charterUuid: string | null;
  charterTitle?: string | null;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset whenever the panel is reopened.
  useEffect(() => {
    if (open) {
      setMessage("");
      setSent(false);
      setError(null);
    }
  }, [open]);

  // Escape to dismiss, and lock the page behind the overlay.
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

  async function handleSend() {
    if (!charterUuid || message.trim() === "") return;
    setSending(true);
    setError(null);
    try {
      await sendCharterMessage(charterUuid, message.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-portal-deep/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Get in touch"
      onClick={onClose}
    >
      <div
        className="animate-slide-up w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-card-hover sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="portal-field relative px-6 py-5">
          <div className="relative z-10 flex items-start justify-between gap-4">
            {broker ? (
              <BrokerIdentity broker={broker} align="left" avatarSize={48} />
            ) : (
              <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
                Get in touch
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {(broker?.email || broker?.phone) && (
            <div className="flex flex-wrap gap-2">
              {broker?.email && (
                <a
                  href={`mailto:${broker.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-hairline px-3.5 py-2 text-sm text-portal-navy transition-colors hover:border-portal-blue hover:text-portal-blue"
                >
                  <Mail className="h-4 w-4" />
                  {broker.email}
                </a>
              )}
              {broker?.phone && (
                <a
                  href={`tel:${broker.phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-hairline px-3.5 py-2 text-sm text-portal-navy transition-colors hover:border-portal-blue hover:text-portal-blue"
                >
                  <Phone className="h-4 w-4" />
                  {broker.phone}
                </a>
              )}
            </div>
          )}

          {charterUuid === null ? (
            <p className="text-sm text-brand-ink">
              Reach out any time using the details above.
            </p>
          ) : sent ? (
            <div className="flex items-start gap-3 rounded-xl bg-status-active/10 p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-status-active" />
              <p className="text-sm text-portal-navy">
                Message sent. Your specialist has been notified and will come back to you shortly.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="get-in-touch-message"
                  className="u-eyebrow mb-2 block text-portal-navy"
                >
                  Your message
                </label>
                <textarea
                  id="get-in-touch-message"
                  rows={5}
                  maxLength={5000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    charterTitle
                      ? `Anything you need for ${charterTitle}?`
                      : "How can we help?"
                  }
                  className={cn(
                    "w-full resize-none rounded-xl border border-brand-hairline bg-portal-mist/60 p-3.5 text-sm text-portal-navy",
                    "outline-none transition-colors placeholder:text-brand-ink/50 focus:border-portal-blue focus:bg-white",
                  )}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="button"
                onClick={handleSend}
                disabled={sending || message.trim() === ""}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3",
                  "font-display text-[12px] font-bold uppercase tracking-[0.16em] text-white",
                  "bg-portal-navy transition-colors hover:bg-portal-blue",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                Send message
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
