import type { AttendanceStatus } from "./studentTypes";

/**
 * Formats a metric that is already expressed as a percentage (0–100).
 * Never multiplies by 100. Returns "—" for null/undefined/NaN.
 */
export function formatPercent(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  const rounded = Math.round(value * 10 ** digits) / 10 ** digits;
  // Drop trailing .00 but keep meaningful decimals, e.g. 100 -> "100", 85.71 -> "85.71"
  const trimmed = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return `${trimmed}%`;
}

/** Same as formatPercent but returns the bare number string, no "%". Still "—" for null. */
export function formatNumber(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  const rounded = Math.round(value * 10 ** digits) / 10 ** digits;
  return String(rounded);
}

export function getAttendanceStatus(value: number | null | undefined): AttendanceStatus {
  if (value === null || value === undefined || Number.isNaN(value)) return "unknown";
  if (value >= 90) return "excellent";
  if (value >= 75) return "good";
  return "needs-attention";
}

export const attendanceStatusLabel: Record<AttendanceStatus, string> = {
  excellent: "Excellent",
  good: "Good",
  "needs-attention": "Needs attention",
  unknown: "No data",
};

/** Formats an ISO timestamp (e.g. releaseDate) into "30 Aug 2026". Returns "—" if unparseable. */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Clamps a possibly-null percentage into a 0-100 number safe for progress bars/charts. */
export function toSafeProgress(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}
