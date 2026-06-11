/**
 * Admin dashboard — system overview with live KPIs.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, Calendar, DollarSign, Activity, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import Loading from '@/components/shared/Loading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import analyticsService from '@/services/analyticsService';
import { orderStatusVariant } from '@/utils/orderHelpers';

function apptLabel(a) {
  const patient = a.patientId?.userId?.name || 'Patient';
  const doctor = a.doctorId?.userId?.name || 'Doctor';
  return `${patient} → ${doctor}`;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  usePageTitle('Admin Dashboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .overview()
      .then(setData)
      .catch((e) => toast.error(e.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total users" value={data?.totalUsers ?? 0} icon={Users} />
            <StatCard label="Active doctors" value={data?.totalDoctors ?? 0} icon={Stethoscope} />
            <StatCard label="Appointments today" value={data?.appointmentsToday ?? 0} icon={Calendar} />
            <StatCard
              label="Revenue (mo.)"
              value={`PKR ${(data?.revenueMonth ?? 0).toLocaleString()}`}
              icon={DollarSign}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent appointments</CardTitle>
                <CardDescription>Latest booking activity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(data?.recentAppointments || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No appointments yet.</p>
                ) : (
                  data.recentAppointments.map((a) => (
                    <div
                      key={a._id}
                      className="flex items-center justify-between rounded-md border border-border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{apptLabel(a)}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.timeSlot} · {new Date(a.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={a.status === 'confirmed' ? 'success' : 'warning'}>{a.status}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>Latest e-commerce activity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(data?.recentOrders || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders yet.</p>
                ) : (
                  data.recentOrders.map((o) => (
                    <div
                      key={o._id}
                      className="flex items-center justify-between rounded-md border border-border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{o.patientId?.userId?.name || 'Patient'}</p>
                        <p className="text-xs text-muted-foreground">PKR {o.totalAmount?.toLocaleString()}</p>
                      </div>
                      <Badge variant={orderStatusVariant(o.status)}>{o.status}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
