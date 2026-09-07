import type { StudentApiResponse, StudentApiResult } from "./studentTypes";
import { isStudentApiError } from "./studentTypes";

// ---------------------------------------------------------------------------
// Single place the Apps Script Web App URL lives. Everything else imports
// fetchStudent() below rather than touching this constant directly.
//
// Set VITE_APPS_SCRIPT_WEB_APP_URL in a .env file to override without
// touching code (see .env.example).
// ---------------------------------------------------------------------------
const APPS_SCRIPT_WEB_APP_URL: string =
  import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL ??
  "https://script.google.com/macros/s/AKfycbyzLDMkZm0p7R1Gm8IUY9H0LMS_s0WE86FdE47jt7U6M817sP0m597XDPaL8S4-Vxu4Og/exec";

// TEMPORARY DIAGNOSTIC LOGGING — confirms whether the Vercel env var actually
// made it into this build, vs. silently falling back to the hardcoded URL.
console.log(
  "Using Apps Script URL from:",
  import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL ? "environment variable" : "hardcoded fallback",
  "→",
  APPS_SCRIPT_WEB_APP_URL
);

export class StudentNotFoundError extends Error {
  constructor(message = "Student not found") {
    super(message);
    this.name = "StudentNotFoundError";
  }
}

export class StudentApiNetworkError extends Error {
  constructor(message = "Unable to load student data. Please try again.") {
    super(message);
    this.name = "StudentApiNetworkError";
  }
}

/**
 * Fetches a single student's record from the Apps Script JSON API.
 * Throws StudentNotFoundError for a known "not found" API response, or
 * StudentApiNetworkError for any network / parsing / unexpected failure.
 */
export async function fetchStudent(studentId: string): Promise<StudentApiResponse> {
  const trimmedId = studentId.trim();
  const url = `${APPS_SCRIPT_WEB_APP_URL}?student_id=${encodeURIComponent(trimmedId)}`;

  // TEMPORARY DIAGNOSTIC LOGGING — remove once the production issue is confirmed fixed.
  console.log("API URL:", url);

  let response: Response;
  try {
    response = await fetch(url, { method: "GET" });
  } catch (err) {
    console.log("Fetch threw (likely CORS or network failure):", err);
    throw new StudentApiNetworkError();
  }

  // TEMPORARY DIAGNOSTIC LOGGING — remove once the production issue is confirmed fixed.
  console.log("Response status:", response.status);
  console.log("Response URL:", response.url);
  console.log("Response type:", response.type);
  console.log("Response headers:", [...response.headers.entries()]);

  if (!response.ok) {
    console.log("Response not ok, status was:", response.status);
    throw new StudentApiNetworkError();
  }

  let data: StudentApiResult;
  try {
    data = (await response.json()) as StudentApiResult;
  } catch (err) {
    console.log("response.json() failed to parse — body was likely not JSON:", err);
    throw new StudentApiNetworkError();
  }

  // TEMPORARY DIAGNOSTIC LOGGING — remove once the production issue is confirmed fixed.
  console.log("Parsed response body:", data);

  if (isStudentApiError(data)) {
    throw new StudentNotFoundError(data.error || "Student not found");
  }

  // Basic shape guard so a malformed payload doesn't silently render blanks.
  if (!data || !data.student || !data.performance) {
    throw new StudentApiNetworkError();
  }

  return data as StudentApiResponse;
}
