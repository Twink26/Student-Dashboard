// ---------------------------------------------------------------------------
// Types matching the Google Apps Script JSON API response, verbatim.
// Nothing outside studentApi.ts / studentAdapter.ts should import these.
// ---------------------------------------------------------------------------

export interface SubjectApiResponse {
  name: string;
  attendance: number | null;
  classAttendance: number | null;
  labAttendance: number | null;
  assignmentAttempt: number | null;
  assignmentCompletion: number | null;
  assessmentAttempt: number | null;
  assessmentPerformance: number | null;
}

export interface StudentInfoApiResponse {
  name: string;
  enrollment: string;
  email: string;
  batch: string;
}

export interface PerformanceApiResponse {
  overallAttendance: number | null;
  subjects: SubjectApiResponse[];
}

export interface AssessmentApiResponse {
  assessmentId: string;
  name: string;
  type: string;
  courseId: number;
  releaseDate: string;
  totalQuestions: number;
  openCount: number;
  attemptCount: number;
  correctSubmissions: number;
  wrongSubmissions: number;
  marks: number;
  maxMarks: number;
  percentage: number | null;
}

export interface StudentApiResponse {
  studentId: string;
  student: StudentInfoApiResponse;
  performance: PerformanceApiResponse;
  /** Optional for backwards compatibility with API responses predating this field. */
  assessments?: AssessmentApiResponse[];
}

export interface StudentApiErrorResponse {
  error: string;
}

export type StudentApiResult = StudentApiResponse | StudentApiErrorResponse;

export function isStudentApiError(
  result: StudentApiResult
): result is StudentApiErrorResponse {
  return (result as StudentApiErrorResponse).error !== undefined;
}

// ---------------------------------------------------------------------------
// Internal frontend model. Components only ever see these shapes — they have
// no knowledge of the Apps Script / Google Sheet field names.
// ---------------------------------------------------------------------------

export interface Subject {
  name: string;
  attendance: number | null;
  classAttendance: number | null;
  labAttendance: number | null;
  assignmentAttempt: number | null;
  assignmentCompletion: number | null;
  assessmentAttempt: number | null;
  assessmentPerformance: number | null;
}

export interface StudentProfile {
  studentId: string;
  name: string;
  enrollment: string;
  email: string;
  batch: string;
}

export interface Performance {
  overallAttendance: number | null;
  subjects: Subject[];
  /** Derived, transparent averages across subjects — never fabricated. */
  averageAssessmentPerformance: number | null;
  averageAssignmentCompletion: number | null;
  averageAssessmentAttempt: number | null;
}

export type AttemptStatus = "attempted" | "not-attempted";

export interface Assessment {
  assessmentId: string;
  name: string;
  type: string;
  courseId: number;
  releaseDate: string;
  marks: number;
  maxMarks: number;
  percentage: number | null;
  attemptStatus: AttemptStatus;
}

export interface Student {
  profile: StudentProfile;
  performance: Performance;
  assessments: Assessment[];
}

export type AttendanceStatus = "excellent" | "good" | "needs-attention" | "unknown";
