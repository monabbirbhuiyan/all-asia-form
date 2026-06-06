'use client';

import { CheckCircle2, CircleAlert, X } from 'lucide-react';
import { dismissToast, useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3 p-4">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={cn(
            'pointer-events-auto rounded-2xl border bg-card p-4 shadow-lg backdrop-blur-sm transition-all',
            toastItem.variant === 'destructive'
              ? 'border-destructive/30 bg-destructive/10 text-destructive-foreground'
              : 'border-border/60 bg-card/95 text-foreground'
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn('mt-0.5 flex h-8 w-8 items-center justify-center rounded-full', toastItem.variant === 'destructive' ? 'bg-destructive/15 text-destructive' : 'bg-primary/10 text-primary')}>
              {toastItem.variant === 'destructive' ? (
                <CircleAlert className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-5">{toastItem.title}</p>
              {toastItem.description && (
                <p className="mt-1 text-sm text-muted-foreground">{toastItem.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toastItem.id)}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
