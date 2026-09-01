import { GraduationCap } from "lucide-react";
import StudentSearch from "./StudentSearch";

interface HeaderProps {
  onSearch: (studentId: string) => void;
  isLoading: boolean;
  compact?: boolean;
}

export default function Header({ onSearch, isLoading, compact = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white">
            <GraduationCap size={18} strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-[17px] text-ink">Rishihood Student Analytics</p>
            <p className="text-xs text-ink-soft">Live academic performance</p>
          </div>
        </div>

        {compact && (
          <div className="sm:w-80">
            <StudentSearch onSearch={onSearch} isLoading={isLoading} compact />
          </div>
        )}
      </div>
    </header>
  );
}
