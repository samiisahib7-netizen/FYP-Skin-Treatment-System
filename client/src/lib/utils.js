import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class names with Tailwind merge.
 * Used by shadcn/ui primitives.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format a number as PKR currency (default FYP locale). */
export function formatCurrency(amount, currency = 'PKR') {
  if (amount == null || Number.isNaN(Number(amount))) return '—';
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

/** Format an ISO date as "Jan 15, 2026". */
export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
