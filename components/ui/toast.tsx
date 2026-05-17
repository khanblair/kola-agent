'use client';

import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  variant?: ToastVariant;
  message: string;
  onClose?: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-green-300 bg-green-50 text-green-800',
  error: 'border-red-300 bg-red-50 text-red-800',
  info: 'border-blue-300 bg-blue-50 text-blue-800',
  warning: 'border-amber-300 bg-amber-50 text-amber-800',
};

export function Toast({ variant = 'info', message, onClose }: ToastProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm',
        variantStyles[variant],
      )}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
