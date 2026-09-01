import type { Subject } from "../lib/studentTypes";
import { formatPercent, toSafeProgress, getAttendanceStatus } from "../lib/formatters";

interface SubjectCardProps {
  subject: Subject;
}

interface MetricRowProps {
  label: string;
  value: number | null;
  tone?: "brand" | "gold";
}

function MetricRow({ label, value, tone = "brand" }: MetricRowProps) {
  const status = getAttendanceStatus(value);
  const barColor =
    tone === "gold"
      ? "bg-gold"
      : status === "needs-attention"
        ? "bg-bad"
        : status === "unknown"
          ? "bg-line"
          : "bg-brand";

  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-ink-soft">{label}</span>
        <span className="font-mono text-[12px] text-ink">{formatPercent(value)}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${toSafeProgress(value)}%` }}
        />
      </div>
    </div>
  );
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h3 className="font-display text-base text-ink">{subject.name}</h3>

      <div className="mt-4 space-y-3">
        <MetricRow label="Overall attendance" value={subject.attendance} />
        <MetricRow label="Class attendance" value={subject.classAttendance} />
        <MetricRow label="Lab attendance" value={subject.labAttendance} />
      </div>

      <div className="my-4 border-t border-line-soft" />

      <div className="space-y-3">
        <MetricRow label="Assignment attempt" value={subject.assignmentAttempt} tone="gold" />
        <MetricRow label="Assignment completion" value={subject.assignmentCompletion} tone="gold" />
        <MetricRow label="Assessment attempt" value={subject.assessmentAttempt} tone="gold" />
        <MetricRow label="Assessment performance" value={subject.assessmentPerformance} tone="gold" />
      </div>
    </div>
  );
}
