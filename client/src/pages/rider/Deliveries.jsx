/**
 * Rider — active assigned deliveries + status updates.
 */
import { useEffect, useState } from 'react';
import { Truck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePageTitle } from '@/hooks/usePageTitle';
import orderService from '@/services/orderService';
import { orderStatusVariant, patientNameFromOrder } from '@/utils/orderHelpers';

const RIDER_ACTIONS = {
  shipped: { next: 'out-for-delivery', label: 'Out for delivery' },
  'out-for-delivery': { next: 'delivered', label: 'Mark delivered' },
};

export default function RiderDeliveries() {
  usePageTitle('My Deliveries');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    orderService
      .list()
      .then((orders) => setItems(orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')))
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await orderService.updateStatus(id, status);
      toast.success('Status updated');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="My Deliveries" description="Update delivery status as you complete each stop." icon={Truck} />

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No active deliveries" description="Assigned orders will appear here." />
      ) : (
        <div className="space-y-3">
          {items.map((o) => {
            const action = RIDER_ACTIONS[o.status];
            return (
              <Card key={o._id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{patientNameFromOrder(o)}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {o.shippingAddress}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {o.items?.length || 0} item(s) · PKR {o.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={orderStatusVariant(o.status)}>{o.status}</Badge>
                    {action ? (
                      <Button
                        size="sm"
                        disabled={busyId === o._id}
                        onClick={() => updateStatus(o._id, action.next)}
                      >
                        {action.label}
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
