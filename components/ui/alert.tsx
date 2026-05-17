import { cn } from '@/lib/utils/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const variants: Record<AlertVariant, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error: 'bg-red-50 border-red-200 text-red-800',
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export function Alert({ variant = 'info', className, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn('rounded-lg border p-4 text-sm', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
