import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Subject } from "../lib/studentTypes";

interface SubjectPerformanceChartsProps {
  subjects: Subject[];
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number | null; name: string; payload: { label: string } }>;
}

function shortName(name: string): string {
  const words = name.split(/\s+/);
  if (words.length <= 2) return name;
  return words.map((w) => w[0]).join("");
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  const value = entry.value;
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-ink">{entry.payload.label}</p>
      <p className="mt-0.5 text-ink-soft">
        {value === null || value === undefined ? "No data" : `${value}%`}
      </p>
    </div>
  );
}

function ChartBlock({
  title,
  data,
  color,
}: {
  title: string;
  data: Array<{ label: string; short: string; value: number | null }>;
  color: string;
}) {
  const hasAnyData = data.some((d) => d.value !== null);

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h3 className="font-display text-sm text-ink">{title}</h3>
      <div className="mt-3 h-52">
        {hasAnyData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line-soft)" vertical={false} />
              <XAxis
                dataKey="short"
                tick={{ fontSize: 11, fill: "var(--color-ink-soft)" }}
                axisLine={{ stroke: "var(--color-line)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "var(--color-ink-soft)" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-line-soft)" }} />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-soft">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubjectPerformanceCharts({ subjects }: SubjectPerformanceChartsProps) {
  const attendanceData = subjects.map((s) => ({
    label: s.name,
    short: shortName(s.name),
    value: s.attendance,
  }));
  const assessmentData = subjects.map((s) => ({
    label: s.name,
    short: shortName(s.name),
    value: s.assessmentPerformance,
  }));
  const assignmentData = subjects.map((s) => ({
    label: s.name,
    short: shortName(s.name),
    value: s.assignmentCompletion,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ChartBlock title="Attendance by subject" data={attendanceData} color="var(--color-brand)" />
      <ChartBlock title="Assessment performance" data={assessmentData} color="var(--color-gold)" />
      <ChartBlock title="Assignment completion" data={assignmentData} color="var(--color-good)" />
    </div>
  );
}
