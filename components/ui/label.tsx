import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    />
  ),
);

Label.displayName = 'Label';
