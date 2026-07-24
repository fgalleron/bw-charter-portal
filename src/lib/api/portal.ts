import { API_PREFIX, apiGet, apiPost } from "@/lib/api/client";
import type {
  CharterDetail,
  CharterDocumentKey,
  ChartersResponse,
  LegalDocument,
  PendingLegalDocument,
  PortalMe,
  UsefulInformationResponse,
} from "@/lib/types/portal";

// =============================================================================
// Auth (passwordless, one-time code)
// =============================================================================

/**
 * Always resolves, whatever the email: the API answers 204 for unknown
 * addresses too, so the UI must never reveal whether an account exists.
 */
export async function requestCode(email: string): Promise<void> {
  await apiPost<void>("/auth/request-code", { email });
}

export async function verifyCode(email: string, code: string): Promise<void> {
  await apiPost<void>("/auth/verify", { email, code });
}

export async function getMe(): Promise<PortalMe> {
  return apiGet<PortalMe>("/auth/me");
}

export async function logout(): Promise<void> {
  await apiPost<void>("/auth/logout");
}

// =============================================================================
// Charters
// =============================================================================

export async function listCharters(): Promise<ChartersResponse> {
  return apiGet<ChartersResponse>("/charters");
}

export async function getCharter(uuid: string): Promise<CharterDetail> {
  return apiGet<CharterDetail>(`/charters/${uuid}`);
}

export async function getUsefulInformation(uuid: string): Promise<UsefulInformationResponse> {
  return apiGet<UsefulInformationResponse>(`/charters/${uuid}/useful-information`);
}

export async function sendCharterMessage(uuid: string, message: string): Promise<void> {
  await apiPost<void>(`/charters/${uuid}/messages`, { message });
}

/**
 * Records that the client has opened a trackable document (itinerary, charter
 * agreement) at its current revision, flipping its tab to "seen".
 */
export async function markDocumentSeen(
  uuid: string,
  key: CharterDocumentKey,
): Promise<void> {
  await apiPost<void>(`/charters/${uuid}/documents/${key}/seen`, {});
}

/**
 * Proxy-relative href: the browser follows the 302 to a short-lived presigned
 * URL, so the file itself is never served through the portal.
 */
export function agreementDownloadHref(uuid: string): string {
  return `${API_PREFIX}/charters/${uuid}/agreement/download`;
}

// =============================================================================
// Legal
// =============================================================================

export async function getLegalDocument(type: "terms" | "privacy"): Promise<LegalDocument> {
  return apiGet<LegalDocument>(`/legal/${type}`);
}

export async function acceptLegalDocuments(
  documentIds: number[],
): Promise<{ accepted: boolean; pendingLegalDocuments: PendingLegalDocument[] }> {
  return apiPost<{ accepted: boolean; pendingLegalDocuments: PendingLegalDocument[] }>(
    "/legal/accept",
    { documentIds },
  );
}
