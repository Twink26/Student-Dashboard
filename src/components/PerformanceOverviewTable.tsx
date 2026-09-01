import type { Subject } from "../lib/studentTypes";
import { formatPercent, getAttendanceStatus } from "../lib/formatters";

interface PerformanceOverviewTableProps {
  subjects: Subject[];
}

const dotColor: Record<string, string> = {
  excellent: "bg-good",
  good: "bg-good",
  "needs-attention": "bg-bad",
  unknown: "bg-line",
};

export default function PerformanceOverviewTable({ subjects }: PerformanceOverviewTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs text-ink-soft">
            <th className="px-5 py-3 font-medium">Subject</th>
            <th className="px-5 py-3 font-medium">Attendance</th>
            <th className="px-5 py-3 font-medium">Assignment completion</th>
            <th className="px-5 py-3 font-medium">Assessment performance</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.name} className="border-b border-line-soft last:border-0">
              <td className="px-5 py-3 text-ink">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${dotColor[getAttendanceStatus(subject.attendance)]}`} />
                  {subject.name}
                </div>
              </td>
              <td className="px-5 py-3 font-mono text-[13px] text-ink">{formatPercent(subject.attendance)}</td>
              <td className="px-5 py-3 font-mono text-[13px] text-ink">{formatPercent(subject.assignmentCompletion)}</td>
              <td className="px-5 py-3 font-mono text-[13px] text-ink">{formatPercent(subject.assessmentPerformance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
