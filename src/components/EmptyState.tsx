import { SearchCheck } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-surface/60 px-6 py-20 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
        <SearchCheck size={20} aria-hidden />
      </span>
      <p className="font-display text-lg text-ink">Search for a student</p>
      <p className="max-w-sm text-sm text-ink-soft">
        Enter a Student ID above to view academic performance.
      </p>
    </div>
  );
}
