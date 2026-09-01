import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  suggestion?: string;
}

export default function ErrorState({ message, suggestion }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-bad/30 bg-bad-soft px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-bad">
        <AlertCircle size={20} aria-hidden />
      </span>
      <p className="font-display text-lg text-ink">{message}</p>
      {suggestion && <p className="max-w-sm text-sm text-ink-soft">{suggestion}</p>}
    </div>
  );
}
