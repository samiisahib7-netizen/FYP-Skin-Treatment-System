/**
 * Rider dashboard — assigned orders + delivery status update.
 */
import { Link } from 'react-router-dom';
import { Truck, MapPin, Package, CheckCircle2 } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';

const STATUS_VARIANT = {
  pending: 'warning',
  'out-for-delivery': 'info',
  delivered: 'success',
};

export default function RiderDashboard() {
  const { user } = useAuth();
  usePageTitle('Rider Dashboard');

  const assigned = [
    { _id: 'o1', customer: 'Mahrukh J.', address: 'House 12, Lahore', items: 2, status: 'pending' },
    { _id: 'o2', customer: 'Ali Raza', address: 'Block B, Karachi', items: 1, status: 'out-for-delivery' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={`Hi, ${user?.name?.split(' ')[0] || 'Rider'} 🚚`}
        description="Your assigned deliveries for today."
        icon={Truck}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Assigned" value={assigned.length} icon={Package} />
        <StatCard label="Out for delivery" value={assigned.filter((o) => o.status === 'out-for-delivery').length} icon={Truck} />
        <StatCard label="Delivered" value="12" icon={CheckCircle2} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Assigned orders</CardTitle>
          <CardDescription>Update status as you deliver.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {assigned.map((o) => (
            <div key={o._id} className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{o.customer}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {o.address}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{o.items} item(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[o.status] || 'default'}>{o.status}</Badge>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
