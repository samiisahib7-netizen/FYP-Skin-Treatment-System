/**
 * Doctor — manage appointments (confirm / complete / cancel).
 */
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import appointmentService from '@/services/appointmentService';
import { formatApptDate, patientName, statusVariant } from '@/utils/appointmentHelpers';

export default function DoctorAppointments() {
  usePageTitle('Appointments');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    appointmentService
      .list(statusFilter ? { status: statusFilter } : {})
      .then(setItems)
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
      await appointmentService.updateStatus(id, status);
      toast.success(`Marked as ${status}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Appointments" description="Review and update patient bookings." icon={Calendar}>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No appointments" description="Patient bookings will appear here." />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((a) => (
                <TableRow key={a._id}>
                  <TableCell className="font-medium">{patientName(a)}</TableCell>
                  <TableCell>{formatApptDate(a.date)}</TableCell>
                  <TableCell>{a.timeSlot}</TableCell>
                  <TableCell className="text-muted-foreground">{a.reason || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                  </TableCell>
                  <TableCell className="space-x-1 text-right">
                    {a.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          disabled={busyId === a._id}
                          onClick={() => updateStatus(a._id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === a._id}
                          onClick={() => updateStatus(a._id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : null}
                    {a.status === 'confirmed' ? (
                      <>
                        <Button
                          size="sm"
                          disabled={busyId === a._id}
                          onClick={() => updateStatus(a._id, 'completed')}
                        >
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === a._id}
                          onClick={() => updateStatus(a._id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : null}
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
