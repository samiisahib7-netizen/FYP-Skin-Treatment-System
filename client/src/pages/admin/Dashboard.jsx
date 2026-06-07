/**
 * Admin dashboard — system overview with KPIs and quick links.
 */
import { Link } from 'react-router-dom';
import { Users, Stethoscope, Calendar, ShoppingBag, DollarSign, Activity, ArrowRight } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AdminDashboard() {
  const { user } = useAuth();
  usePageTitle('Admin Dashboard');

  const recentAppointments = [
    { _id: 'a1', patient: 'Mahrukh J.', doctor: 'Dr. Ayesha', time: '10:30', status: 'confirmed' },
    { _id: 'a2', patient: 'Ali Raza', doctor: 'Dr. Imran', time: '11:30', status: 'pending' },
  ];

  const recentOrders = [
    { _id: 'o1', patient: 'Mahrukh J.', total: 2400, status: 'shipped' },
    { _id: 'o2', patient: 'Sara K.', total: 1800, status: 'pending' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Admin'}`}
        description="Monitor and manage the entire platform."
        icon={Activity}
      >
        <Button asChild variant="outline">
          <Link to="/admin/analytics">
            View analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value="128" icon={Users} trend="+12 this week" />
        <StatCard label="Active doctors" value="14" icon={Stethoscope} />
        <StatCard label="Appointments today" value="23" icon={Calendar} />
        <StatCard label="Revenue (mo.)" value="PKR 240,000" icon={DollarSign} trend="+18% vs last" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent appointments</CardTitle>
            <CardDescription>Latest booking activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentAppointments.map((a) => (
              <div key={a._id} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                <div>
                  <p className="font-medium">{a.patient} → {a.doctor}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
                <Badge variant={a.status === 'confirmed' ? 'success' : 'warning'}>{a.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Latest e-commerce activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentOrders.map((o) => (
              <div key={o._id} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                <div>
                  <p className="font-medium">{o.patient}</p>
                  <p className="text-xs text-muted-foreground">PKR {o.total.toLocaleString()}</p>
                </div>
                <Badge variant={o.status === 'shipped' ? 'info' : 'warning'}>{o.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
