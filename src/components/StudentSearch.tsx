import { useState, type FormEvent } from "react";
import { Loader2, Search } from "lucide-react";

interface StudentSearchProps {
  onSearch: (studentId: string) => void;
  isLoading: boolean;
  compact?: boolean;
  initialValue?: string;
}

export default function StudentSearch({
  onSearch,
  isLoading,
  compact = false,
  initialValue = "",
}: StudentSearchProps) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const trimmed = value.trim();
  const showEmptyWarning = touched && trimmed.length === 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!trimmed || isLoading) return;
    onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        className={`flex items-center gap-2 rounded-lg border bg-surface px-3 transition-colors ${
          showEmptyWarning ? "border-bad" : "border-line focus-within:border-brand"
        } ${compact ? "py-1.5" : "py-2.5"}`}
      >
        <Search size={16} className="shrink-0 text-ink-soft" aria-hidden />
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (touched) setTouched(false);
          }}
          placeholder="Enter Student ID"
          aria-label="Student ID"
          disabled={isLoading}
          className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-md bg-brand font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60 ${
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" aria-hidden />
              Loading
            </>
          ) : (
            "View Dashboard"
          )}
        </button>
      </div>
      {showEmptyWarning && (
        <p className="mt-1.5 text-xs text-bad">Enter a Student ID to continue.</p>
      )}
    </form>
  );
}
