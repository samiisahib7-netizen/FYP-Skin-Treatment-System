/**
 * Rider dashboard — assigned deliveries overview.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, MapPin, Package, CheckCircle2, ArrowRight } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import orderService from '@/services/orderService';
import { orderStatusVariant, patientNameFromOrder } from '@/utils/orderHelpers';

export default function RiderDashboard() {
  const { user } = useAuth();
  usePageTitle('Rider Dashboard');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.list().then(setOrders).catch(() => {});
  }, []);

  const active = useMemo(
    () => orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)),
    [orders]
  );
  const outForDelivery = active.filter((o) => o.status === 'out-for-delivery').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;

  return (
    <DashboardLayout>
      <PageHeader
        title={`Hi, ${user?.name?.split(' ')[0] || 'Rider'} 🚚`}
        description="Your assigned deliveries for today."
        icon={Truck}
      >
        <Button asChild variant="outline">
          <Link to="/rider/deliveries">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Assigned" value={active.length} icon={Package} />
        <StatCard label="Out for delivery" value={outForDelivery} icon={Truck} />
        <StatCard label="Delivered" value={delivered} icon={CheckCircle2} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Active deliveries</CardTitle>
          <CardDescription>Tap manage to update status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {active.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active deliveries assigned.</p>
          ) : (
            active.slice(0, 5).map((o) => (
              <div
                key={o._id}
                className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{patientNameFromOrder(o)}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {o.shippingAddress}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={orderStatusVariant(o.status)}>{o.status}</Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/rider/deliveries">Manage</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
