import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <div className="text-6xl font-bold text-primary-600">404</div>
      <div className="text-center max-w-md">
        <h2 className="text-lg font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
