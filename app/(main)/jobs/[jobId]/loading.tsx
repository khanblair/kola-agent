export default function JobDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="animate-pulse space-y-3">
        <div className="h-8 w-64 rounded-lg bg-neutral-200" />
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-neutral-200" />
          <div className="h-6 w-24 rounded bg-neutral-100" />
        </div>
      </div>
      <div className="animate-pulse rounded-xl border border-neutral-200 p-6 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-neutral-200" />
            <div className="h-4 w-80 rounded bg-neutral-100" />
          </div>
          <div className="h-16 w-16 rounded-full bg-neutral-200" />
        </div>
        <div className="h-px bg-neutral-200" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-neutral-100" style={{ width: `${60 + i * 10}%` }} />
          ))}
        </div>
      </div>
      <div className="animate-pulse grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-neutral-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 rounded bg-neutral-200" />
                <div className="h-3 w-16 rounded bg-neutral-100" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded bg-neutral-100" />
              <div className="h-3 w-3/4 rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
