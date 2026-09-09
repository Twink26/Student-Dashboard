import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { StudentSummary, AttendanceStatus } from "../lib/studentTypes";
import { formatPercent, getAttendanceStatus, attendanceStatusLabel } from "../lib/formatters";

interface BatchStudentTableProps {
  students: StudentSummary[];
  onSelectStudent: (studentId: string) => void;
}

type SortKey = "name" | "overallAttendance" | "avgAssessmentPerformance" | "avgAssignmentCompletion";
type SortDirection = "asc" | "desc";

const columns: { key: SortKey; label: string }[] = [
  { key: "name", label: "Student" },
  { key: "overallAttendance", label: "Attendance" },
  { key: "avgAssessmentPerformance", label: "Assessment" },
  { key: "avgAssignmentCompletion", label: "Assignment" },
];

const statusStyles: Record<AttendanceStatus, string> = {
  excellent: "text-good bg-good-soft",
  good: "text-good bg-good-soft",
  "needs-attention": "text-bad bg-bad-soft",
  unknown: "text-ink-soft bg-line-soft",
};

function compareValues(
  a: StudentSummary,
  b: StudentSummary,
  key: SortKey,
  direction: SortDirection
): number {
  let result: number;
  if (key === "name") {
    result = a.name.localeCompare(b.name);
  } else {
    const aVal = a[key];
    const bVal = b[key];
    // Nulls sort last regardless of direction, so missing data doesn't hide at the top.
    if (aVal === null && bVal === null) result = 0;
    else if (aVal === null) result = 1;
    else if (bVal === null) result = -1;
    else result = aVal - bVal;
  }
  return direction === "asc" ? result : -result;
}

export default function BatchStudentTable({ students, onSelectStudent }: BatchStudentTableProps) {
  // Default: attendance ascending, so students needing attention surface first.
  const [sortKey, setSortKey] = useState<SortKey>("overallAttendance");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sorted = useMemo(() => {
    return [...students].sort((a, b) => compareValues(a, b, sortKey, sortDirection));
  }, [students, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection(key === "name" ? "asc" : "asc");
    }
  }

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center text-sm text-ink-soft">
        No students found in this batch.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-150 border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs text-ink-soft">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort(col.key)}
                  className="flex items-center gap-1 hover:text-ink"
                >
                  {col.label}
                  {sortKey === col.key &&
                    (sortDirection === "asc" ? (
                      <ArrowUp size={12} aria-hidden />
                    ) : (
                      <ArrowDown size={12} aria-hidden />
                    ))}
                </button>
              </th>
            ))}
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((student) => {
            const status = getAttendanceStatus(student.overallAttendance);
            return (
              <tr
                key={student.studentId}
                onClick={() => onSelectStudent(student.studentId)}
                className="cursor-pointer border-b border-line-soft transition-colors last:border-0 hover:bg-brand-soft/40"
              >
                <td className="px-5 py-3 text-ink">
                  <p className="font-medium">{student.name}</p>
                  <p className="font-mono text-[11px] text-ink-soft">{student.studentId}</p>
                </td>
                <td className="px-5 py-3 font-mono text-[13px] text-ink">
                  {formatPercent(student.overallAttendance)}
                </td>
                <td className="px-5 py-3 font-mono text-[13px] text-ink">
                  {formatPercent(student.avgAssessmentPerformance)}
                </td>
                <td className="px-5 py-3 font-mono text-[13px] text-ink">
                  {formatPercent(student.avgAssignmentCompletion)}
                </td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[status]}`}>
                    {attendanceStatusLabel[status]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}