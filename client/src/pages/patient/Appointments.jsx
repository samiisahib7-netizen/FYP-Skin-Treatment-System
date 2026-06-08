/**
 * Patient — list of booked appointments.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import appointmentService from '@/services/appointmentService';
import { doctorName, formatApptDate, statusVariant } from '@/utils/appointmentHelpers';

export default function PatientAppointments() {
  const navigate = useNavigate();
  usePageTitle('My Appointments');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService
      .list()
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title="My Appointments" description="View and manage your bookings." icon={Calendar}>
        <Button asChild>
          <Link to="/patient/appointments/new">
            <Plus className="h-4 w-4" /> Book appointment
          </Link>
        </Button>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState
          title="No appointments yet"
          description="Book your first consultation with a dermatologist."
          actionLabel="Book now"
          onAction={() => navigate('/patient/appointments/new')}
        />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((a) => (
                <TableRow key={a._id}>
                  <TableCell className="font-medium">{doctorName(a)}</TableCell>
                  <TableCell>{formatApptDate(a.date)}</TableCell>
                  <TableCell>{a.timeSlot}</TableCell>
                  <TableCell className="text-muted-foreground">{a.reason || '—'}</TableCell>
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
