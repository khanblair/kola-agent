import { cn } from '@/lib/utils/cn';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <div
      className={cn('overflow-auto scrollbar-thin', className)}
      {...props}
    >
      {children}
    </div>
  );
}
