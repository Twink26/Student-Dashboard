function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-line-soft ${className}`} />;
}

export default function LoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading student data…</span>

      <div className="rounded-xl border border-line bg-surface p-6">
        <div className="flex items-center gap-4">
          <Bone className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Bone className="h-5 w-48" />
            <Bone className="h-3 w-24" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-line bg-surface p-5">
            <Bone className="h-9 w-9 rounded-md" />
            <Bone className="mt-3 h-7 w-16" />
            <Bone className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-line bg-surface p-5">
            <Bone className="h-4 w-2/3" />
            <Bone className="h-2 w-full" />
            <Bone className="h-2 w-full" />
            <Bone className="h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
