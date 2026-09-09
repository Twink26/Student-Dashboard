import { Users } from "lucide-react";
import type { BatchAnalytics } from "../lib/studentTypes";
import { formatPercent } from "../lib/formatters";

interface BatchOverviewCardProps {
  batch: BatchAnalytics;
  onSelect: (batch: string) => void;
}

export default function BatchOverviewCard({ batch, onSelect }: BatchOverviewCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(batch.batch)}
      className="w-full rounded-xl border border-line bg-surface p-5 text-left transition-colors hover:border-brand/40"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">Batch {batch.batch}</h3>
        <span className="flex items-center gap-1 text-xs text-ink-soft">
          <Users size={13} aria-hidden />
          {batch.studentCount}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="font-display text-lg text-ink">{formatPercent(batch.avgOverallAttendance)}</p>
          <p className="mt-0.5 text-[11px] text-ink-soft">Attendance</p>
        </div>
        <div>
          <p className="font-display text-lg text-ink">{formatPercent(batch.avgAssessmentPerformance)}</p>
          <p className="mt-0.5 text-[11px] text-ink-soft">Assessment</p>
        </div>
        <div>
          <p className="font-display text-lg text-ink">{formatPercent(batch.avgAssignmentCompletion)}</p>
          <p className="mt-0.5 text-[11px] text-ink-soft">Assignment</p>
        </div>
      </div>
    </button>
  );
}