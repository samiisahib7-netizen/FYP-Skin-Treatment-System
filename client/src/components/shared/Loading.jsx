import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Reusable loading spinner.
 * Variants: inline | fullscreen | section
 */
export default function Loading({ variant = 'inline', label = 'Loading…', className }) {
  if (variant === 'fullscreen') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className={cn('flex items-center justify-center gap-2 py-12 text-muted-foreground', className)}>
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">{label}</span>
      </div>
    );
  }

  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} aria-label="Loading" />;
}
