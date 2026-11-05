/**
 * Contact form submission.
 *
 * The provided GDGoC UGM API only exposes read-only (GET) endpoints, so there
 * is no server to post an inquiry to. To keep the form fully functional and
 * easy to wire up later, this module:
 *   - POSTs JSON to NEXT_PUBLIC_INQUIRY_ENDPOINT when that variable is set
 *     (any form backend, e.g. Formspree / a serverless function), and
 *   - otherwise simulates a short network round-trip so the whole UX
 *     (validation, pending state, success dialog, draft clearing) can be
 *     demonstrated.
 */

export interface InquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  category: string;
  subject: string;
  message: string;
}

const ENDPOINT = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT;

export const isInquirySimulated = !ENDPOINT;

export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  if (!ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}.`);
  }
}
