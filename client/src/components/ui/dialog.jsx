import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Lightweight dialog built on the native <dialog> element.
 * No external dependencies; matches shadcn's API surface.
 *
 * Usage:
 *   <Dialog open={open} onOpenChange={setOpen} title="Edit" description="...">
 *     <p>Body</p>
 *   </Dialog>
 */
const Dialog = ({ open, onOpenChange, title, description, children, className }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Sync the close button + ESC back to parent state
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => onOpenChange?.(false);
    el.addEventListener('close', handleClose);
    return () => el.removeEventListener('close', handleClose);
  }, [onOpenChange]);

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        // close when clicking the backdrop
        if (e.target === ref.current) ref.current.close();
      }}
      className={cn(
        'm-auto w-full max-w-lg rounded-lg border border-border bg-background p-0 shadow-lg backdrop:bg-black/40',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border p-4">
        <div>
          {title ? <h2 className="text-lg font-semibold text-foreground">{title}</h2> : null}
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  );
};

export { Dialog };
