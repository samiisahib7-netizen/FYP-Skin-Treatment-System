/**
 * Generic role dashboard placeholder.
 * Replaced by real dashboards module-by-module.
 */
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function RoleHome({ role }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-border bg-white">
        <div className="container-app flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            <span>🩺</span> Skin Treatment
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.name} · <span className="font-medium capitalize text-foreground">{role}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <section className="container-app py-10">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name} 👋</CardTitle>
            <CardDescription>
              You are signed in as <span className="font-medium capitalize text-foreground">{role}</span>.
              This is a Module 1 placeholder — real dashboards land in later modules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>✅ Auth (Module 1) — done</p>
            <p>⏳ Patient profile, appointments, prescriptions, products, orders, payments… coming next.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
