/**
 * Patient dashboard — landing page after login.
 * Shows upcoming appointment, recent prescriptions, recent orders, and quick actions.
 * Day 1 version: static placeholders. Day 5/6 wires to real data.
 */
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

export default function PatientDashboard() {
  const { user } = useAuth();
  usePageTitle('Patient Dashboard');

  // Placeholder data — replaced by API calls in Day 5/6
  const upcoming = { doctor: 'Dr. Ayesha Khan', date: 'Tomorrow', time: '10:30 AM' };
  const recentRx = [{ _id: 'r1', doctor: 'Dr. Ayesha Khan', issuedAt: '2026-05-30', medicines: 3 }];
  const recentOrders = [{ _id: 'o1', total: 2400, status: 'shipped', placedAt: '2026-06-02' }];

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
        <StatCard label="Upcoming appointments" value="1" icon={Calendar} />
        <StatCard label="Prescriptions" value={recentRx.length} icon={Pill} />
        <StatCard label="Medical reports" value="0" icon={FileText} />
        <StatCard label="Active orders" value="1" icon={ShoppingBag} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next appointment</CardTitle>
            <CardDescription>Don't forget to arrive 10 minutes early.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{upcoming.doctor}</p>
                <p className="text-sm text-muted-foreground">
                  {upcoming.date} · {upcoming.time}
                </p>
              </div>
              <Badge variant="info">Confirmed</Badge>
            </div>
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
            {recentRx[0] ? (
              <div>
                <p className="font-medium">{recentRx[0].doctor}</p>
                <p className="text-sm text-muted-foreground">
                  {recentRx[0].medicines} medicines · {new Date(recentRx[0].issuedAt).toDateString()}
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
