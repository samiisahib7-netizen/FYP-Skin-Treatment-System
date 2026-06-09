/**
 * Patient dashboard — upcoming appointment + recent prescriptions.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Pill, FileText, ShoppingBag, Plus, ArrowRight } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import appointmentService from '@/services/appointmentService';
import prescriptionService from '@/services/prescriptionService';
import reportService from '@/services/reportService';
import orderService from '@/services/orderService';
import { doctorName, formatApptDate, statusVariant } from '@/utils/appointmentHelpers';

export default function PatientDashboard() {
  const { user } = useAuth();
  usePageTitle('Patient Dashboard');
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reportCount, setReportCount] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);

  useEffect(() => {
    appointmentService.list().then(setAppointments).catch(() => {});
    prescriptionService.list().then(setPrescriptions).catch(() => {});
    reportService.list().then((r) => setReportCount(r.length)).catch(() => {});
    orderService
      .list()
      .then((orders) =>
        setActiveOrders(orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length)
      )
      .catch(() => {});
  }, []);

  const upcoming = useMemo(() => {
    const active = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
    return active.sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;
  }, [appointments]);

  const recentRx = prescriptions[0] || null;

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        description="Here's a quick look at your skin-care journey."
        icon={Calendar}
      >
        <Button asChild>
          <Link to="/patient/appointments/new">
            <Plus className="h-4 w-4" /> Book appointment
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Upcoming appointments"
          value={appointments.filter((a) => ['pending', 'confirmed'].includes(a.status)).length}
          icon={Calendar}
        />
        <StatCard label="Prescriptions" value={prescriptions.length} icon={Pill} />
        <StatCard label="Medical reports" value={reportCount} icon={FileText} />
        <StatCard label="Active orders" value={activeOrders} icon={ShoppingBag} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next appointment</CardTitle>
            <CardDescription>Don't forget to arrive 10 minutes early.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcoming ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{doctorName(upcoming)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatApptDate(upcoming.date)} · {upcoming.timeSlot}
                  </p>
                </div>
                <Badge variant={statusVariant(upcoming.status)}>{upcoming.status}</Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
            )}
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/patient/appointments">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent prescription</CardTitle>
            <CardDescription>Issued by your dermatologist.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRx ? (
              <div>
                <p className="font-medium">{recentRx.doctorId?.userId?.name || 'Doctor'}</p>
                <p className="text-sm text-muted-foreground">
                  {recentRx.medicines?.length || 0} medicines ·{' '}
                  {new Date(recentRx.issuedAt || recentRx.createdAt).toDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No prescriptions yet.</p>
            )}
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/patient/prescriptions">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
