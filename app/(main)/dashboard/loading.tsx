export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-neutral-200" />
        <div className="mt-1 h-4 w-64 rounded bg-neutral-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-neutral-200 p-5">
            <div className="h-10 w-10 rounded-lg bg-neutral-200" />
            <div className="mt-3 h-4 w-24 rounded bg-neutral-100" />
            <div className="mt-2 h-8 w-16 rounded bg-neutral-200" />
          </div>
        ))}
      </div>
      <div className="animate-pulse space-y-2">
        <div className="h-5 w-32 rounded bg-neutral-200" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-28 rounded-lg bg-neutral-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
