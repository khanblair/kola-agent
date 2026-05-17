import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl border border-border bg-background shadow-sm', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={cn('px-4 sm:px-6 py-4 border-b border-border', className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn('px-4 sm:px-6 py-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={cn('px-4 sm:px-6 py-4 border-t border-border', className)} {...props} />;
}
