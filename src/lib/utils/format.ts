/**
 * Date formatting for the portal. Always en-GB, matching the mockups
 * ("7 - 14 July 2026", "Updated 28 May").
 */
const LOCALE = "en-GB";

function parse(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Charter window, collapsing the parts the two dates share:
 *   same month  -> "7 - 14 July 2026"
 *   same year   -> "28 June - 4 July 2026"
 *   otherwise   -> "28 December 2026 - 4 January 2027"
 */
export function formatCharterDates(
  start: string | null,
  end: string | null,
): string | null {
  const from = parse(start);
  const to = parse(end);

  if (!from && !to) return null;
  if (from && !to) return from.toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });
  if (!from && to) return to.toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });
  if (!from || !to) return null;

  const sameYear = from.getFullYear() === to.getFullYear();
  const sameMonth = sameYear && from.getMonth() === to.getMonth();

  if (sameMonth) {
    const month = to.toLocaleDateString(LOCALE, { month: "long", year: "numeric" });
    return `${from.getDate()} - ${to.getDate()} ${month}`;
  }

  if (sameYear) {
    const fromPart = from.toLocaleDateString(LOCALE, { day: "numeric", month: "long" });
    const toPart = to.toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });
    return `${fromPart} - ${toPart}`;
  }

  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  return `${from.toLocaleDateString(LOCALE, opts)} - ${to.toLocaleDateString(LOCALE, opts)}`;
}

/** "28 May" — the day/month stamp shown under each document. */
export function formatUpdated(iso: string | null): string | null {
  const date = parse(iso);
  if (!date) return null;
  return date.toLocaleDateString(LOCALE, { day: "numeric", month: "long" });
}

/** Two-letter initials used when a broker has no photo. */
export function initials(firstName?: string | null, lastName?: string | null): string {
  const a = (firstName ?? "").trim().charAt(0);
  const b = (lastName ?? "").trim().charAt(0);
  return `${a}${b}`.toUpperCase() || "BW";
}

export function fullName(firstName?: string | null, lastName?: string | null): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}
