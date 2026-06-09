/**
 * Patient — order history.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import orderService from '@/services/orderService';
import { orderStatusVariant } from '@/utils/orderHelpers';

export default function PatientOrders() {
  usePageTitle('My Orders');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .list()
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title="My Orders" description="Track your skincare product orders." icon={ShoppingBag}>
        <Button asChild variant="outline">
          <Link to="/patient/store">
            <Package className="h-4 w-4" /> Shop more
          </Link>
        </Button>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your placed orders will appear here."
          actionLabel="Browse store"
          onAction={() => window.location.assign('/patient/store')}
        />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>{new Date(o.placedAt || o.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{o.items?.length || 0} item(s)</TableCell>
                  <TableCell className="font-medium">PKR {o.totalAmount?.toLocaleString()}</TableCell>
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
