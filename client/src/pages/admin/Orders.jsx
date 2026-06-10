/**
 * Admin — all orders, status management, rider assignment.
 */
import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import orderService from '@/services/orderService';
import riderService from '@/services/riderService';
import { orderStatusVariant, patientNameFromOrder } from '@/utils/orderHelpers';

const NEXT_STATUS = {
  pending: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['out-for-delivery', 'cancelled'],
  'out-for-delivery': ['delivered', 'cancelled'],
};

export default function AdminOrders() {
  usePageTitle('All Orders');
  const [items, setItems] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      orderService.list(statusFilter ? { status: statusFilter } : {}),
      riderService.list().catch(() => []),
    ])
      .then(([orders, riderList]) => {
        setItems(orders);
        setRiders(riderList);
      })
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    try {
      await orderService.updateStatus(id, status);
      toast.success(`Order marked ${status}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  const assignRider = async (orderId, riderId) => {
    if (!riderId) return;
    setAssigningId(orderId);
    try {
      await orderService.assignRider(orderId, riderId);
      toast.success('Rider assigned');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Assign failed');
    } finally {
      setAssigningId(null);
    }
  };

  const riderLabel = (r) => r.name || r.userId?.name || r.rider?.userId?.name || 'Rider';
  const riderProfileId = (r) => r.rider?._id || r._id;

  return (
    <DashboardLayout>
      <PageHeader title="All Orders" description="Monitor payments, assign riders, update fulfillment." icon={ShoppingBag}>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="out-for-delivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No orders" description="Patient orders will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assign rider</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((o) => (
                <TableRow key={o._id}>
                  <TableCell className="font-medium">{patientNameFromOrder(o)}</TableCell>
                  <TableCell>PKR {o.totalAmount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={orderStatusVariant(o.status)}>{o.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {['paid', 'shipped'].includes(o.status) ? (
                      <Select
                        className="min-w-[140px]"
                        defaultValue=""
                        disabled={assigningId === o._id}
                        onChange={(e) => assignRider(o._id, e.target.value)}
                      >
                        <option value="">
                          {o.riderId?.userId?.name ? `Assigned: ${o.riderId.userId.name}` : 'Select rider'}
                        </option>
                        {riders.map((r) => (
                          <option key={riderProfileId(r)} value={riderProfileId(r)}>
                            {riderLabel(r)}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="space-x-1 text-right">
                    {(NEXT_STATUS[o.status] || []).map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={s === 'cancelled' ? 'outline' : 'default'}
                        disabled={busyId === o._id}
                        onClick={() => updateStatus(o._id, s)}
                      >
                        {s}
                      </Button>
                    ))}
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
