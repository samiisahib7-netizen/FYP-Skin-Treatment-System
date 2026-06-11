import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StarRating({ value = 0, onChange, size = 'md', readOnly = false }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn(
            'rounded p-0.5 transition-colors',
            readOnly ? 'cursor-default' : 'hover:scale-110',
            star <= value ? 'text-amber-400' : 'text-slate-300'
          )}
          aria-label={`${star} star`}
        >
          <Star className={cn(sizes[size], star <= value && 'fill-current')} />
        </button>
      ))}
    </div>
  );
}
