import type {
  ApiEnvelope,
  Faq,
  InquiryCategory,
  JourneyStep,
  LearningFormat,
  NavItem,
  Role,
  Stats,
  Track,
  Value,
} from "./types";

/**
 * Base URL used by the browser. By default requests go through the Next.js
 * rewrite defined in next.config.ts (`/gdgoc-api/*` -> upstream API), which
 * avoids CORS. Set NEXT_PUBLIC_API_BASE_URL to call the API directly instead.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/gdgoc-api"
).replace(/\/$/, "");

const REQUEST_TIMEOUT_MS = 12_000;
const DEFAULT_RETRIES = 1;

export type ApiErrorKind = "network" | "timeout" | "http" | "parse" | "api";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    "data" in value
  );
}

async function requestOnce<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("timeout", "The request took too long to respond.");
    }
    throw new ApiError("network", "Could not reach the server.");
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new ApiError(
      "http",
      `The server answered with status ${response.status}.`,
      response.status,
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError("parse", "The server sent a response we could not read.");
  }

  if (!isEnvelope<T>(body)) {
    throw new ApiError("parse", "The server sent an unexpected response shape.");
  }
  if (!body.success) {
    throw new ApiError("api", "The API reported that the request failed.");
  }
  return body.data;
}

function isRetryable(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (error.kind === "network" || error.kind === "timeout") return true;
  return error.kind === "http" && (error.status ?? 0) >= 500;
}

/** GET a path and return the unwrapped `data`, retrying transient failures. */
async function request<T>(path: string, retries = DEFAULT_RETRIES): Promise<T> {
  let attempt = 0;
  for (;;) {
    try {
      return await requestOnce<T>(path);
    } catch (error) {
      if (!isRetryable(error) || attempt >= retries) throw error;
      attempt += 1;
      await sleep(400 * 2 ** attempt);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Endpoints                                                           */
/* ------------------------------------------------------------------ */
/* Each fetcher is a stable module-level function so it can be used as a
   dependency / cache identity by the `useApi` hook. */

export const getNavigation = () => request<NavItem[]>("/navigation");
export const getStats = () => request<Stats>("/stats");
export const getFaqs = () => request<Faq[]>("/faqs");
export const getInquiryCategories = () =>
  request<InquiryCategory[]>("/inquiry-categories");
export const getRoles = () => request<Role[]>("/roles");
export const getJourney = () => request<JourneyStep[]>("/journey");
export const getFormats = () => request<LearningFormat[]>("/formats");
export const getValues = () => request<Value[]>("/values");
export const getTracks = () => request<Track[]>("/tracks");
export const getTrack = (id: string) =>
  request<Track>(`/tracks/${encodeURIComponent(id)}`);

/* ------------------------------------------------------------------ */
/* Human-readable error copy                                           */
/* ------------------------------------------------------------------ */

export function describeError(error: unknown): { title: string; message: string } {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case "network":
        return {
          title: "We can't reach the server",
          message: "Check your connection and try again in a moment.",
        };
      case "timeout":
        return {
          title: "That took too long",
          message: "The server is slow to respond right now. Please try again.",
        };
      case "http":
        return {
          title: "Something went wrong on our side",
          message: `${error.message} Please try again shortly.`,
        };
      default:
        return {
          title: "We couldn't load this section",
          message: "The data came back in a shape we didn't expect.",
        };
    }
  }
  return {
    title: "Something went wrong",
    message: "An unexpected error occurred while loading this section.",
  };
}
