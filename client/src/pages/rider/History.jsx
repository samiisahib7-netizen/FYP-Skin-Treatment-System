/**
 * Rider — completed delivery history.
 */
import { useEffect, useState } from 'react';
import { Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import orderService from '@/services/orderService';
import { orderStatusVariant, patientNameFromOrder } from '@/utils/orderHelpers';

export default function RiderHistory() {
  usePageTitle('Delivery History');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .list({ status: 'delivered' })
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title="Delivery history" description="Completed deliveries." icon={Receipt} />

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No completed deliveries" description="Delivered orders will show here." />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>{patientNameFromOrder(o)}</TableCell>
                  <TableCell>{new Date(o.placedAt || o.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>PKR {o.totalAmount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={orderStatusVariant(o.status)}>{o.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </DashboardLayout>
  );
}
