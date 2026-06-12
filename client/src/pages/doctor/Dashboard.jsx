/**
 * Doctor dashboard — today's appointments + quick actions.
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Pill, CheckCircle2 } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import Loading from '@/components/shared/Loading';
import ErrorState from '@/components/shared/ErrorState';
import TableWrap from '@/components/shared/TableWrap';
import EmptyState from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import useFetch from '@/hooks/useFetch';
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

  const { data, loading, error, reload } = useFetch(async () => {
    const [appointments, prescriptions] = await Promise.all([
      appointmentService.list(),
      prescriptionService.list(),
    ]);
    return { appointments, rxCount: prescriptions.length };
  }, []);

  const today = useMemo(
    () => (data?.appointments || []).filter((a) => isToday(a.date)),
    [data]
  );
  const completed = (data?.appointments || []).filter((a) => a.status === 'completed').length;

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

      {loading ? (
        <Loading variant="section" label="Loading schedule…" />
      ) : error ? (
        <ErrorState description={error} onRetry={reload} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Today's appointments" value={today.length} icon={Calendar} />
            <StatCard label="Total appointments" value={data.appointments.length} icon={Users} />
            <StatCard label="Prescriptions issued" value={data.rxCount} icon={Pill} />
            <StatCard label="Completed" value={completed} icon={CheckCircle2} />
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Today's schedule</CardTitle>
              <CardDescription>{new Date().toDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              {today.length === 0 ? (
                <EmptyState
                  title="No appointments today"
                  description="Your schedule is clear. Check the appointments page for upcoming visits."
                  actionLabel="View appointments"
                  onAction={() => window.location.assign('/doctor/appointments')}
                />
              ) : (
                <TableWrap className="border-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead className="hidden sm:table-cell">Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {today.map((a) => (
                        <TableRow key={a._id}>
                          <TableCell className="font-medium whitespace-nowrap">{a.timeSlot}</TableCell>
                          <TableCell>{patientName(a)}</TableCell>
                          <TableCell className="hidden text-muted-foreground sm:table-cell">
                            {a.reason || '—'}
                          </TableCell>
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
                </TableWrap>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
