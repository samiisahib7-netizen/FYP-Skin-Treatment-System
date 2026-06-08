/**
 * Doctor dashboard — today's appointments + quick actions.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Pill, CheckCircle2 } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import appointmentService from '@/services/appointmentService';
import prescriptionService from '@/services/prescriptionService';
import { patientName, statusVariant } from '@/utils/appointmentHelpers';

function isToday(dateStr) {
  const d = new Date(dateStr);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  usePageTitle('Doctor Dashboard');
  const [appointments, setAppointments] = useState([]);
  const [rxCount, setRxCount] = useState(0);

  useEffect(() => {
    appointmentService.list().then(setAppointments).catch(() => {});
    prescriptionService.list().then((r) => setRxCount(r.length)).catch(() => {});
  }, []);

  const today = useMemo(() => appointments.filter((a) => isToday(a.date)), [appointments]);
  const completed = appointments.filter((a) => a.status === 'completed').length;

  return (
    <DashboardLayout>
      <PageHeader
        title={`Dr. ${user?.name?.split(' ').slice(-1)[0] || 'Doctor'}`}
        description="Manage today's appointments and patient records."
        icon={Calendar}
      >
        <Button asChild>
          <Link to="/doctor/prescriptions/new">
            <Pill className="h-4 w-4" /> New prescription
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's appointments" value={today.length} icon={Calendar} />
        <StatCard label="Total appointments" value={appointments.length} icon={Users} />
        <StatCard label="Prescriptions issued" value={rxCount} icon={Pill} />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Today's schedule</CardTitle>
          <CardDescription>{new Date().toDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          {today.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments scheduled for today.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {today.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell className="font-medium">{a.timeSlot}</TableCell>
                    <TableCell>{patientName(a)}</TableCell>
                    <TableCell className="text-muted-foreground">{a.reason || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/doctor/appointments">Manage</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
