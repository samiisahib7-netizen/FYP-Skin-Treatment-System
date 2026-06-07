/**
 * StatCard — KPI tile for dashboards.
 *   <StatCard label="Total revenue" value="PKR 240,000" icon={DollarSign} />
 */
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function StatCard({ label, value, icon: Icon, trend, className }) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {Icon ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
        </div>
        <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        {trend ? <p className="mt-1 text-xs text-muted-foreground">{trend}</p> : null}
      </CardContent>
    </Card>
  );
}
