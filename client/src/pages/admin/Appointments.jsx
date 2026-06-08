/**
 * Admin — all appointments with status filter.
 */
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import appointmentService from '@/services/appointmentService';
import { doctorName, formatApptDate, patientName, statusVariant } from '@/utils/appointmentHelpers';

export default function AdminAppointments() {
  usePageTitle('All Appointments');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    appointmentService
      .list(statusFilter ? { status: statusFilter } : {})
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <DashboardLayout>
      <PageHeader title="All Appointments" description="System-wide appointment overview." icon={Calendar}>
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
        <EmptyState title="No appointments" description="Bookings will appear here as patients schedule." />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{patientName(a)}</TableCell>
                  <TableCell>{doctorName(a)}</TableCell>
                  <TableCell>{formatApptDate(a.date)}</TableCell>
                  <TableCell>{a.timeSlot}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
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
