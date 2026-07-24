export type CharterStatus = "active" | "completed" | "cancelled";

export const CHARTER_STATUS_LABELS: Record<CharterStatus, string> = {
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface PortalBroker {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  /** Presigned S3 URL (24h). Null when the broker has no approved photo. */
  photoUrl: string | null;
  /** No job-title column exists yet; the UI falls back to a default label. */
  title: string | null;
}

export interface CharterPhoto {
  thumb: string;
  medium: string;
  large: string;
}

export type CharterDocumentKey =
  | "yacht_selection"
  | "itinerary"
  | "charter_agreement"
  | "preference_list";

export interface CharterDocument {
  key: CharterDocumentKey;
  label: string;
  /** False renders the row disabled rather than hiding it. */
  available: boolean;
  url: string | null;
  external: boolean;
  updatedAt: string | null;
  /** Seen state for trackable documents (itinerary, agreement); null otherwise. */
  seen: boolean | null;
  /** Charter agreement version shown on the tab; null for other documents. */
  version: number | null;
}

export interface CharterCard {
  uuid: string;
  title: string;
  status: CharterStatus;
  destinationName: string | null;
  charterStartDate: string | null;
  charterEndDate: string | null;
  photo: CharterPhoto | null;
  documentsCount: number;
  broker: PortalBroker | null;
}

export interface CharterDetail extends CharterCard {
  documents: CharterDocument[];
  itineraryLink: string | null;
}

export interface ChartersResponse {
  charters: CharterCard[];
  /** Broker shown in the header: the one owning the most recent active charter. */
  accountBroker: PortalBroker | null;
}

export interface PendingLegalDocument {
  id: number;
  type: "terms" | "privacy";
  version: number;
  title: string;
}

export interface PortalMe {
  firstName: string;
  lastName: string;
  email: string;
  lastLoginAt: string | null;
  pendingLegalDocuments: PendingLegalDocument[];
  ctx: string;
}

export interface PortalUsefulInfoItem {
  id: number;
  name: string;
  type: "document" | "link";
  /** Set on link items. */
  url: string | null;
  /** Set on document items. */
  document: { originalFileName: string | null; downloadUrl: string } | null;
}

export interface UsefulInformationResponse {
  items: PortalUsefulInfoItem[];
}

export interface LegalDocument {
  id: number;
  type: "terms" | "privacy";
  version: number;
  title: string;
  content: string;
  publishedAt: string | null;
}
