/**
 * TableWrap — horizontal scroll on small screens.
 */
export default function TableWrap({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-border bg-white ${className}`}>
      {children}
    </div>
  );
}
