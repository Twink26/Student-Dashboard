import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BatchAnalytics } from "../lib/studentTypes";

interface BatchComparisonChartProps {
  batches: BatchAnalytics[];
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number | null; payload: { batch: string } }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-ink">Batch {entry.payload.batch}</p>
      <p className="mt-0.5 text-ink-soft">
        {entry.value === null || entry.value === undefined ? "No data" : `${entry.value}%`}
      </p>
    </div>
  );
}

export default function BatchComparisonChart({ batches }: BatchComparisonChartProps) {
  const data = batches.map((b) => ({
    batch: b.batch,
    value: b.avgOverallAttendance,
  }));

  const hasAnyData = data.some((d) => d.value !== null);

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <h3 className="font-display text-sm text-ink">Average attendance by batch</h3>
      <div className="mt-3 h-56">
        {hasAnyData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line-soft)" vertical={false} />
              <XAxis
                dataKey="batch"
                tickFormatter={(value) => `Batch ${value}`}
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
              <Bar dataKey="value" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={64} />
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