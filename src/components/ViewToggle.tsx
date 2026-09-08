interface ViewToggleProps {
  mode: "student" | "sections";
  onChange: (mode: "student" | "sections") => void;
}

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-1 text-xs">
      <button
        type="button"
        onClick={() => onChange("student")}
        className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
          mode === "student" ? "bg-brand text-white" : "text-ink-soft hover:text-ink"
        }`}
      >
        Student
      </button>
      <button
        type="button"
        onClick={() => onChange("sections")}
        className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
          mode === "sections" ? "bg-brand text-white" : "text-ink-soft hover:text-ink"
        }`}
      >
        Sections
      </button>
    </div>
  );
}