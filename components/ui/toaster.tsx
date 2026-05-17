'use client';

import { Toast, type ToastVariant } from './toast';
import { X } from 'lucide-react';

interface ToastEntry {
  id: string;
  variant: ToastVariant;
  message: string;
}

interface ToasterProps {
  toasts: ToastEntry[];
  onDismiss: (id: string) => void;
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          message={t.message}
          onClose={() => onDismiss(t.id)}
        />
      ))}
    </div>
  );
}

export type { ToastEntry, ToastVariant };
