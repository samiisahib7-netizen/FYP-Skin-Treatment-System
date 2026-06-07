/**
 * DashboardLayout — wraps every role-protected page.
 * Renders Topbar + Sidebar + main content area.
 * Responsive: sidebar collapses to a slide-in drawer on mobile.
 */
import { useState } from 'react';
import Topbar from './Topbar';
import RoleSidebar from './RoleSidebar';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/shared/Loading';

export default function DashboardLayout({ children }) {
  const { isLoading, role } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isLoading) return <Loading variant="fullscreen" />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar onMenuClick={() => setDrawerOpen(true)} />

      <div className="flex">
        <RoleSidebar role={role} />

        {/* Mobile drawer */}
        {drawerOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-white shadow-lg md:hidden">
              <div className="h-16 border-b border-border" />
              <RoleSidebar role={role} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </>
        ) : null}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
