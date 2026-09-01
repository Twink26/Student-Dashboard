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
  "https://script.google.com/a/macros/newtonschool.co/s/AKfycbzi2sfsgnWDlgULMMYUJhafrJ2KDQfH--qzcnqY1jW44skau8tJ0PkgwT7WztaRglx7Ig/exec";

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

  let response: Response;
  try {
    response = await fetch(url, { method: "GET" });
  } catch {
    throw new StudentApiNetworkError();
  }

  if (!response.ok) {
    throw new StudentApiNetworkError();
  }

  let data: StudentApiResult;
  try {
    data = (await response.json()) as StudentApiResult;
  } catch {
    throw new StudentApiNetworkError();
  }

  if (isStudentApiError(data)) {
    throw new StudentNotFoundError(data.error || "Student not found");
  }

  // Basic shape guard so a malformed payload doesn't silently render blanks.
  if (!data || !data.student || !data.performance) {
    throw new StudentApiNetworkError();
  }

  return data as StudentApiResponse;
}
