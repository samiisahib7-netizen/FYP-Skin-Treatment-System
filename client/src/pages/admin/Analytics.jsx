/**
 * Admin analytics — KPIs and charts from real API data.
 */
import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import Loading from '@/components/shared/Loading';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePageTitle } from '@/hooks/usePageTitle';
import analyticsService from '@/services/analyticsService';
import { Users, Stethoscope, Calendar, DollarSign } from 'lucide-react';

const PIE_COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export default function AdminAnalytics() {
  usePageTitle('Analytics');
  const [overview, setOverview] = useState(null);
  const [apptStats, setApptStats] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.overview(),
      analyticsService.appointmentsByStatus(),
      analyticsService.ordersByStatus(),
      analyticsService.revenueByMonth(),
    ])
      .then(([ov, appts, orders, rev]) => {
        setOverview(ov);
        setApptStats(appts);
        setOrderStats(orders);
        setRevenue(rev);
      })
      .catch((e) => toast.error(e.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Loading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Analytics"
        description="Platform performance and activity metrics."
        icon={BarChart3}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={overview?.totalUsers ?? 0} icon={Users} />
        <StatCard label="Active doctors" value={overview?.totalDoctors ?? 0} icon={Stethoscope} />
        <StatCard label="Appointments today" value={overview?.appointmentsToday ?? 0} icon={Calendar} />
        <StatCard
          label="Revenue (month)"
          value={`PKR ${(overview?.revenueMonth ?? 0).toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
            <CardDescription>Successful payments — last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {revenue.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payment data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`PKR ${Number(v).toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointments by status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {apptStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointments yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={apptStats} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label>
                    {apptStats.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {orderStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between border-b py-2">
              <span className="text-muted-foreground">Total patients</span>
              <span className="font-medium">{overview?.totalPatients ?? 0}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-muted-foreground">Pending appointments</span>
              <span className="font-medium">{overview?.pendingAppointments ?? 0}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-muted-foreground">Total orders</span>
              <span className="font-medium">{overview?.totalOrders ?? 0}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">All-time revenue</span>
              <span className="font-medium">PKR {(overview?.revenueAll ?? 0).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
