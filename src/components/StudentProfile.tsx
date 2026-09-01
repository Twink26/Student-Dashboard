import { Mail, Hash, Layers, IdCard } from "lucide-react";
import type { StudentProfile as StudentProfileModel } from "../lib/studentTypes";

interface StudentProfileProps {
  profile: StudentProfileModel;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function StudentProfile({ profile }: StudentProfileProps) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-lg text-brand">
            {initials(profile.name)}
          </span>
          <div>
            <h1 className="font-display text-xl text-ink sm:text-2xl">{profile.name}</h1>
            <p className="mt-0.5 text-sm text-ink-soft">Batch {profile.batch}</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 border-t border-line pt-4 text-sm sm:grid-cols-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          <div className="flex items-center gap-2">
            <Hash size={14} className="shrink-0 text-ink-soft" aria-hidden />
            <div>
              <dt className="text-xs text-ink-soft">Enrollment</dt>
              <dd className="font-mono text-[13px] text-ink">{profile.enrollment}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="shrink-0 text-ink-soft" aria-hidden />
            <div>
              <dt className="text-xs text-ink-soft">Email</dt>
              <dd className="break-all text-[13px] text-ink">{profile.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Layers size={14} className="shrink-0 text-ink-soft" aria-hidden />
            <div>
              <dt className="text-xs text-ink-soft">Batch</dt>
              <dd className="text-[13px] text-ink">{profile.batch}</dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IdCard size={14} className="shrink-0 text-ink-soft" aria-hidden />
            <div>
              <dt className="text-xs text-ink-soft">Student ID</dt>
              <dd className="font-mono text-[13px] text-ink">{profile.studentId}</dd>
            </div>
          </div>
        </dl>
      </div>
    </section>
  );
}
