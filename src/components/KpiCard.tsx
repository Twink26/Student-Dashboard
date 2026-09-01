import type { LucideIcon } from "lucide-react";
import { formatPercent, getAttendanceStatus, attendanceStatusLabel } from "../lib/formatters";
import type { AttendanceStatus } from "../lib/studentTypes";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: number | null;
  /** Show an Excellent/Good/Needs attention badge derived from the value. */
  showStatus?: boolean;
  helpText?: string;
}

const statusStyles: Record<AttendanceStatus, string> = {
  excellent: "text-good bg-good-soft",
  good: "text-good bg-good-soft",
  "needs-attention": "text-bad bg-bad-soft",
  unknown: "text-ink-soft bg-line-soft",
};

export default function KpiCard({ icon: Icon, label, value, showStatus, helpText }: KpiCardProps) {
  const status = getAttendanceStatus(value);

  return (
    <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-soft text-brand">
          <Icon size={16} strokeWidth={2} aria-hidden />
        </span>
        {showStatus && (
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[status]}`}>
            {attendanceStatusLabel[status]}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl text-ink sm:text-3xl">{formatPercent(value)}</p>
      <p className="mt-1 text-xs text-ink-soft">{label}</p>
      {helpText && <p className="mt-2 text-[11px] leading-snug text-ink-soft/80">{helpText}</p>}
    </div>
  );
}
