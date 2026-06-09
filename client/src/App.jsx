/**
 * Root App — full route tree.
 * Public routes: /, /login, /register, /forgot-password, /reset-password/:token
 * Role dashboards: /admin/... /doctor/... /patient/... /rider/...
 */
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

import PatientDashboard from '@/pages/patient/Dashboard';
import PatientAppointments from '@/pages/patient/Appointments';
import BookAppointment from '@/pages/patient/BookAppointment';
import PatientPrescriptions from '@/pages/patient/Prescriptions';
import PatientReports from '@/pages/patient/Reports';
import PatientStore from '@/pages/patient/Store';
import PatientCart from '@/pages/patient/Cart';
import PatientCheckout from '@/pages/patient/Checkout';
import PatientOrders from '@/pages/patient/Orders';

import DoctorDashboard from '@/pages/doctor/Dashboard';
import DoctorAppointments from '@/pages/doctor/Appointments';
import DoctorPrescriptions from '@/pages/doctor/Prescriptions';
import NewPrescription from '@/pages/doctor/NewPrescription';

import AdminDashboard from '@/pages/admin/Dashboard';
import AdminAppointments from '@/pages/admin/Appointments';
import AdminReports from '@/pages/admin/Reports';
import AdminProducts from '@/pages/admin/Products';
import AdminOrders from '@/pages/admin/Orders';

import RiderDashboard from '@/pages/rider/Dashboard';

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            <span className="text-2xl">🩺</span>
            <span>Skin Treatment</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="container-app py-20 text-center">
        <p className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          FYP · BSIT 2022–2026
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Digital skin care, simplified.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
          Book dermatologist appointments, manage prescriptions, access medical reports, and shop
          skincare products — all in one secure platform.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/register">Book an appointment</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

/** Placeholder for routes added in later days — keeps sidebar/topbar visible. */
function ComingSoon({ label }) {
  return (
    <DashboardLayout>
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">This page lands in a later day of the build.</p>
      </div>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ComingSoon label="User Management" /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute roles={['admin']}><ComingSoon label="Manage Doctors" /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute roles={['admin']}><ComingSoon label="Manage Patients" /></ProtectedRoute>} />
      <Route path="/admin/riders" element={<ProtectedRoute roles={['admin']}><ComingSoon label="Manage Riders" /></ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute roles={['admin']}><AdminAppointments /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><ComingSoon label="Analytics Dashboard" /></ProtectedRoute>} />

      {/* Doctor */}
      <Route path="/doctor" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/appointments" element={<ProtectedRoute roles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
      <Route path="/doctor/patients" element={<ProtectedRoute roles={['doctor']}><ComingSoon label="My Patients" /></ProtectedRoute>} />
      <Route path="/doctor/prescriptions" element={<ProtectedRoute roles={['doctor']}><DoctorPrescriptions /></ProtectedRoute>} />
      <Route path="/doctor/prescriptions/new" element={<ProtectedRoute roles={['doctor']}><NewPrescription /></ProtectedRoute>} />
      <Route path="/doctor/notifications" element={<ProtectedRoute roles={['doctor']}><ComingSoon label="Doctor Notifications" /></ProtectedRoute>} />

      {/* Patient */}
      <Route path="/patient" element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute roles={['patient']}><PatientAppointments /></ProtectedRoute>} />
      <Route path="/patient/appointments/new" element={<ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>} />
      <Route path="/patient/prescriptions" element={<ProtectedRoute roles={['patient']}><PatientPrescriptions /></ProtectedRoute>} />
      <Route path="/patient/reports" element={<ProtectedRoute roles={['patient']}><PatientReports /></ProtectedRoute>} />
      <Route path="/patient/store" element={<ProtectedRoute roles={['patient']}><PatientStore /></ProtectedRoute>} />
      <Route path="/patient/cart" element={<ProtectedRoute roles={['patient']}><PatientCart /></ProtectedRoute>} />
      <Route path="/patient/checkout" element={<ProtectedRoute roles={['patient']}><PatientCheckout /></ProtectedRoute>} />
      <Route path="/patient/orders" element={<ProtectedRoute roles={['patient']}><PatientOrders /></ProtectedRoute>} />
      <Route path="/patient/notifications" element={<ProtectedRoute roles={['patient']}><ComingSoon label="Notifications" /></ProtectedRoute>} />

      {/* Rider */}
      <Route path="/rider" element={<ProtectedRoute roles={['rider']}><RiderDashboard /></ProtectedRoute>} />
      <Route path="/rider/deliveries" element={<ProtectedRoute roles={['rider']}><ComingSoon label="My Deliveries" /></ProtectedRoute>} />
      <Route path="/rider/history" element={<ProtectedRoute roles={['rider']}><ComingSoon label="Delivery History" /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
