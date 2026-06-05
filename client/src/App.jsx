/**
 * Root App — route tree.
 * Module 1 (Auth) wires up the public + auth routes. Role dashboards are placeholders
 * that get replaced module-by-module.
 */
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import RoleHome from '@/pages/RoleHome';

/** Public landing page (Module 0 hero, kept for now). */
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

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Role-protected home dashboards (placeholder until per-module dashboards land) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <RoleHome role="admin" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute roles={['doctor']}>
            <RoleHome role="doctor" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient"
        element={
          <ProtectedRoute roles={['patient']}>
            <RoleHome role="patient" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider"
        element={
          <ProtectedRoute roles={['rider']}>
            <RoleHome role="rider" />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
