/**
 * Doctor dashboard — today's appointments + recent patients + quick actions.
 */
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

export default function DoctorDashboard() {
  const { user } = useAuth();
  usePageTitle('Doctor Dashboard');

  const today = [
    { _id: 'a1', patient: 'Mahrukh J.', time: '10:30', reason: 'Acne follow-up', status: 'confirmed' },
    { _id: 'a2', patient: 'Ali Raza', time: '11:30', reason: 'New consultation', status: 'pending' },
    { _id: 'a3', patient: 'Sara K.', time: '14:00', reason: 'Prescription refill', status: 'confirmed' },
  ];

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
        <StatCard label="Total patients" value="42" icon={Users} />
        <StatCard label="Prescriptions issued" value="18" icon={Pill} />
        <StatCard label="Completed this week" value="23" icon={CheckCircle2} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Today's schedule</CardTitle>
          <CardDescription>{new Date().toDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="font-medium">{a.time}</TableCell>
                  <TableCell>{a.patient}</TableCell>
                  <TableCell className="text-muted-foreground">{a.reason}</TableCell>
                  <TableCell>
                    <Badge variant={a.status === 'confirmed' ? 'success' : 'warning'}>
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
