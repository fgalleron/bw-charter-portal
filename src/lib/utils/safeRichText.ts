/**
 * Sanitizes staff-authored HTML before rendering it in the portal. The intranet
 * editor produces clean HTML in practice, but we still scrub it here as
 * defence-in-depth: never trust stored markup blindly when rendering with
 * `dangerouslySetInnerHTML`.
 *
 * Whitelist covers what a legal document needs (headings, paragraphs, lists,
 * emphasis, links). All attributes are dropped except `href` on <a>, and only
 * when it points to http, https or mailto. Every non-whitelisted tag is
 * stripped while preserving its inner text content.
 *
 * The replace loop runs until the string is stable to guard against nested
 * obfuscation attempts like "<<script>script>" that would otherwise leave a
 * real "<script>" behind after a single pass.
 */
const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "a",
]);

const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
const HREF_RE = /\bhref\s*=\s*("([^"]*)"|'([^']*)')/i;
const SAFE_HREF_RE = /^(https?:\/\/|mailto:|\/)/i;

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";

  let current = html;
  // Strip <script>...</script> and <style>...</style> blocks entirely so their
  // inline body doesn't leak through as plain text.
  current = current.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");

  let previous: string;
  do {
    previous = current;
    current = current.replace(TAG_RE, (match, rawTag) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";

      const isClosing = match.startsWith("</");
      if (isClosing) return `</${tag}>`;

      if (tag === "a") {
        const href = HREF_RE.exec(match);
        const value = href?.[2] ?? href?.[3] ?? "";
        if (!SAFE_HREF_RE.test(value)) return "<a>";
        const escaped = value.replace(/"/g, "&quot;").replace(/</g, "&lt;");
        return `<a href="${escaped}" target="_blank" rel="noopener noreferrer">`;
      }

      // Reconstruct without attributes; force lowercase tag name.
      return `<${tag}>`;
    });
  } while (current !== previous);

  return current;
}
