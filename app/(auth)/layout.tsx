export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-background to-accent-50 px-4 py-8">
      {/* Top branding */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">
            KolaAgent
          </span>
        </div>
        <p className="text-sm text-foreground-muted max-w-xs mx-auto">
          Autonomous freelance matching for the African marketplace
        </p>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer */}
      <p className="mt-8 text-xs text-foreground-muted">
        Built for Kolaborate Africa
      </p>
    </div>
  );
}
