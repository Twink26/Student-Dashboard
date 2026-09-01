import { useMemo, useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import type { Assessment } from "../lib/studentTypes";
import { formatDate, formatPercent } from "../lib/formatters";

interface AssessmentHistoryProps {
  assessments: Assessment[];
}

type TypeFilter = "all" | "in-class" | "post-class";

const FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-class", label: "In-Class" },
  { value: "post-class", label: "Post-Class" },
];

function normalizeType(type: string): string {
  return type.trim().toLowerCase().replace(/\s+/g, "-");
}

function matchesTypeFilter(assessmentType: string, filter: TypeFilter): boolean {
  if (filter === "all") return true;
  return normalizeType(assessmentType) === filter;
}

function AttemptBadge({ status }: { status: Assessment["attemptStatus"] }) {
  const isAttempted = status === "attempted";
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        isAttempted ? "bg-good-soft text-good" : "bg-line-soft text-ink-soft"
      }`}
    >
      {isAttempted ? "Attempted" : "Not Attempted"}
    </span>
  );
}

export default function AssessmentHistory({ assessments }: AssessmentHistoryProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");

  const availableTypeFilters = useMemo(() => {
    const presentTypes = new Set(assessments.map((a) => normalizeType(a.type)));
    return FILTERS.filter((f) => f.value === "all" || presentTypes.has(f.value));
  }, [assessments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assessments.filter((a) => {
      const matchesType = matchesTypeFilter(a.type, typeFilter);
      const matchesQuery = q.length === 0 || a.name.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [assessments, typeFilter, query]);

  if (assessments.length === 0) {
    return (
      <section className="rounded-xl border border-line bg-surface p-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-line-soft text-ink-soft">
          <ClipboardList size={18} aria-hidden />
        </span>
        <h3 className="mt-3 font-display text-base text-ink">Assessment history</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-soft">
          No assessment history available.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg text-ink">Assessment history</h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-1.5 rounded-lg border border-line bg-paper p-1 text-xs">
            {availableTypeFilters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  typeFilter === f.value
                    ? "bg-brand text-white"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-line bg-paper px-2.5 py-1.5 sm:w-56">
            <Search size={14} className="shrink-0 text-ink-soft" aria-hidden />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assessments"
              aria-label="Search assessments by name"
              className="w-full min-w-0 bg-transparent text-xs text-ink placeholder:text-ink-soft/70 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 divide-y divide-line-soft">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-soft">
            No assessments match this filter.
          </p>
        ) : (
          filtered.map((assessment) => (
            <div
              key={assessment.assessmentId}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink" title={assessment.name}>
                  {assessment.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-soft">
                  <span>{assessment.type}</span>
                  <span aria-hidden>·</span>
                  <span>{formatDate(assessment.releaseDate)}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                <div className="text-right">
                  <p className="font-mono text-sm text-ink">
                    {assessment.marks} / {assessment.maxMarks}
                  </p>
                  <p className="text-xs text-ink-soft">{formatPercent(assessment.percentage)}</p>
                </div>
                <AttemptBadge status={assessment.attemptStatus} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
