import type {
  StudentApiResponse,
  SubjectApiResponse,
  AssessmentApiResponse,
  SectionAnalyticsApiResponse,
  BatchAnalyticsApiResponse,
  StudentSummaryApiResponse,
  Subject,
  Student,
  Performance,
  Assessment,
  SectionAnalytics,
  BatchAnalytics,
  StudentSummary,
} from "./studentTypes";

function average(values: Array<number | null | undefined>): number | null {
  const usable = values.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  if (usable.length === 0) return null;
  const sum = usable.reduce((acc, v) => acc + v, 0);
  return Math.round((sum / usable.length) * 100) / 100;
}

function adaptSubject(subject: SubjectApiResponse): Subject {
  return {
    name: subject.name,
    attendance: subject.attendance ?? null,
    classAttendance: subject.classAttendance ?? null,
    labAttendance: subject.labAttendance ?? null,
    assignmentAttempt: subject.assignmentAttempt ?? null,
    assignmentCompletion: subject.assignmentCompletion ?? null,
    assessmentAttempt: subject.assessmentAttempt ?? null,
    assessmentPerformance: subject.assessmentPerformance ?? null,
  };
}

function adaptAssessment(assessment: AssessmentApiResponse): Assessment {
  return {
    assessmentId: assessment.assessmentId,
    name: assessment.name,
    type: assessment.type,
    courseId: assessment.courseId,
    releaseDate: assessment.releaseDate,
    marks: assessment.marks,
    maxMarks: assessment.maxMarks,
    // Use the API's own percentage value — never recalculated here.
    percentage: assessment.percentage ?? null,
    attemptStatus: assessment.attemptCount > 0 ? "attempted" : "not-attempted",
  };
}

function sortAssessmentsNewestFirst(assessments: Assessment[]): Assessment[] {
  return [...assessments].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );
}

/**
 * Converts the raw Apps Script API response into the frontend's internal
 * Student model. This is the ONLY place that should know both shapes —
 * components consume `Student` / `Subject` / `Performance` / `Assessment`
 * exclusively.
 */
export function adaptStudentResponse(response: StudentApiResponse): Student {
  const subjects = (response.performance.subjects ?? []).map(adaptSubject);
  const assessments = sortAssessmentsNewestFirst(
    (response.assessments ?? []).map(adaptAssessment)
  );

  const performance: Performance = {
    overallAttendance: response.performance.overallAttendance ?? null,
    subjects,
    // Derived transparently from subject-level data — never fabricated.
    // If the API ever provides a genuine overall figure for these, prefer it.
    averageAssessmentPerformance: average(subjects.map((s) => s.assessmentPerformance)),
    averageAssignmentCompletion: average(subjects.map((s) => s.assignmentCompletion)),
    averageAssessmentAttempt: average(subjects.map((s) => s.assessmentAttempt)),
  };

  return {
    profile: {
      studentId: response.studentId,
      name: response.student.name,
      enrollment: response.student.enrollment,
      email: response.student.email,
      batch: response.student.batch,
    },
    performance,
    assessments,
  };
}

function adaptStudentSummary(summary: StudentSummaryApiResponse): StudentSummary {
  return {
    studentId: summary.studentId,
    name: summary.name,
    enrollment: summary.enrollment,
    overallAttendance: summary.overallAttendance ?? null,
    avgAssessmentPerformance: summary.avgAssessmentPerformance ?? null,
    avgAssignmentCompletion: summary.avgAssignmentCompletion ?? null,
  };
}

function adaptBatchAnalytics(batch: BatchAnalyticsApiResponse): BatchAnalytics {
  return {
    batch: batch.batch,
    studentCount: batch.studentCount,
    avgOverallAttendance: batch.avgOverallAttendance ?? null,
    avgAssessmentPerformance: batch.avgAssessmentPerformance ?? null,
    avgAssignmentCompletion: batch.avgAssignmentCompletion ?? null,
    students: (batch.students ?? []).map(adaptStudentSummary),
  };
}

/**
 * Converts the raw Apps Script section-analytics response into the
 * frontend's internal model. Components consume `SectionAnalytics` /
 * `BatchAnalytics` / `StudentSummary` exclusively.
 */
export function adaptSectionAnalyticsResponse(
  response: SectionAnalyticsApiResponse
): SectionAnalytics {
  return {
    batches: (response.batches ?? []).map(adaptBatchAnalytics),
  };
}