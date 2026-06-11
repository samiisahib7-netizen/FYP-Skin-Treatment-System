/**
 * Patient — order history.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Star } from 'lucide-react';
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
import ReviewFormDialog from '@/components/reviews/ReviewFormDialog';
import { orderStatusVariant } from '@/utils/orderHelpers';

export default function PatientOrders() {
  usePageTitle('My Orders');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState(null);

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
                <TableHead className="text-right">Action</TableHead>
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
                  <TableCell className="text-right">
                    {o.status === 'pending' ? (
                      <Button asChild size="sm">
                        <Link to={`/patient/orders/${o._id}/pay`}>Pay now</Link>
                      </Button>
                    ) : o.status === 'delivered' && o.items?.[0] ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const item = o.items[0];
                          const pid = item.productId?._id || item.productId;
                          setReviewTarget({
                            targetType: 'product',
                            targetId: pid,
                            targetLabel: item.name || 'Product',
                          });
                        }}
                      >
                        <Star className="h-3.5 w-3.5" /> Review
                      </Button>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {reviewTarget ? (
        <ReviewFormDialog
          open={Boolean(reviewTarget)}
          onOpenChange={(v) => !v && setReviewTarget(null)}
          {...reviewTarget}
        />
      ) : null}
    </DashboardLayout>
  );
}
