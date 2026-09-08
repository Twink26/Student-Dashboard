import { useCallback, useState } from "react";
import { CalendarCheck2, ClipboardCheck, ListChecks, Target } from "lucide-react";

import Header from "../components/Header";
import StudentSearch from "../components/StudentSearch";
import StudentProfile from "../components/StudentProfile";
import KpiCard from "../components/KpiCard";
import SubjectCard from "../components/SubjectCard";
import SubjectPerformanceCharts from "../components/SubjectPerformanceCharts";
import PerformanceOverviewTable from "../components/PerformanceOverviewTable";
import AssessmentHistory from "../components/AssessmentHistory";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import SectionsView from "./SectionsView";

import { fetchStudent, StudentNotFoundError, StudentApiNetworkError } from "../lib/studentApi";
import { adaptStudentResponse } from "../lib/studentAdapter";
import type { Student } from "../lib/studentTypes";

type ViewState = "empty" | "loading" | "error" | "ready";
type Mode = "student" | "sections";

export default function Dashboard() {
  const [mode, setMode] = useState<Mode>("student");
  const [student, setStudent] = useState<Student | null>(null);
  const [viewState, setViewState] = useState<ViewState>("empty");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorSuggestion, setErrorSuggestion] = useState<string | undefined>(undefined);

  const isLoading = viewState === "loading";

  const handleSearch = useCallback(async (studentId: string) => {
    setMode("student");
    setViewState("loading");
    setErrorMessage("");
    setErrorSuggestion(undefined);

    try {
      const response = await fetchStudent(studentId);
      const adapted = adaptStudentResponse(response);
      setStudent(adapted);
      setViewState("ready");
    } catch (err) {
      setStudent(null);
      if (err instanceof StudentNotFoundError) {
        setErrorMessage("Student not found");
        setErrorSuggestion("Please check the Student ID and try again.");
      } else if (err instanceof StudentApiNetworkError) {
        setErrorMessage("Unable to load student data. Please try again.");
        setErrorSuggestion(undefined);
      } else {
        setErrorMessage("Unable to load student data. Please try again.");
        setErrorSuggestion(undefined);
      }
      setViewState("error");
    }
  }, []);

  const showHeaderSearch = mode === "student" && viewState !== "empty";

  return (
    <div className="min-h-screen bg-paper">
      <Header
        mode={mode}
        onModeChange={setMode}
        onSearch={handleSearch}
        isLoading={isLoading}
        compact={showHeaderSearch}
      />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {mode === "sections" && <SectionsView onSelectStudent={handleSearch} />}

        {mode === "student" && viewState === "empty" && (
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h1 className="font-display text-3xl text-ink sm:text-4xl">Student Analytics Dashboard</h1>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft sm:text-base">
                Track academic performance, attendance, assignments and assessments.
              </p>
            </div>
            <div className="mt-8">
              <StudentSearch onSearch={handleSearch} isLoading={isLoading} />
            </div>
            <div className="mt-10">
              <EmptyState />
            </div>
          </div>
        )}

        {mode === "student" && viewState === "loading" && <LoadingState />}

        {mode === "student" && viewState === "error" && (
          <ErrorState message={errorMessage} suggestion={errorSuggestion} />
        )}

        {mode === "student" && viewState === "ready" && student && (
          <div className="space-y-8">
            <StudentProfile profile={student.profile} />

            <section>
              <h2 className="mb-3 font-display text-lg text-ink">Key metrics</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <KpiCard
                  icon={CalendarCheck2}
                  label="Overall attendance"
                  value={student.performance.overallAttendance}
                  showStatus
                />
                <KpiCard
                  icon={Target}
                  label="Avg. assessment performance"
                  value={student.performance.averageAssessmentPerformance}
                  helpText="Averaged across subjects"
                />
                <KpiCard
                  icon={ListChecks}
                  label="Avg. assignment completion"
                  value={student.performance.averageAssignmentCompletion}
                  helpText="Averaged across subjects"
                />
                <KpiCard
                  icon={ClipboardCheck}
                  label="Avg. assessment attempt"
                  value={student.performance.averageAssessmentAttempt}
                  helpText="Averaged across subjects"
                />
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-display text-lg text-ink">Subject performance</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {student.performance.subjects.map((subject) => (
                  <SubjectCard key={subject.name} subject={subject} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-display text-lg text-ink">Comparison charts</h2>
              <SubjectPerformanceCharts subjects={student.performance.subjects} />
            </section>

            <section>
              <h2 className="mb-3 font-display text-lg text-ink">Performance overview</h2>
              <PerformanceOverviewTable subjects={student.performance.subjects} />
            </section>

            <AssessmentHistory assessments={student.assessments} />
          </div>
        )}
      </main>
    </div>
  );
}