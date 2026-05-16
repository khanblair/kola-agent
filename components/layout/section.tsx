import { cn } from '@/lib/utils/cn';

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, description, children, className }: SectionProps) {
  return (
    <section className={cn('rounded-xl border border-border bg-background p-4 sm:p-6', className)}>
      {title && (
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-foreground-muted mt-0.5">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
