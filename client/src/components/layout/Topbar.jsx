/**
 * Topbar — brand + user menu + logout.
 * Used by DashboardLayout for all 4 role dashboards.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, ShoppingCart, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, initialsOf } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import useCartStore from '@/store/cartStore';

const ROLE_LABEL = {
  admin: 'Administrator',
  doctor: 'Doctor',
  patient: 'Patient',
  rider: 'Rider',
};

export default function Topbar({ onMenuClick }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.itemCount());

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-white/90 backdrop-blur">
      <div className="container-app flex h-full items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            <span className="text-xl">🩺</span>
            <span className="hidden sm:inline">Skin Treatment</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {role === 'patient' ? (
            <Link
              to="/patient/cart"
              className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              ) : null}
            </Link>
          ) : null}

          <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 rounded-full p-1 pr-3 hover:bg-muted"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initialsOf(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left text-sm sm:block">
              <div className="font-medium leading-tight">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{ROLE_LABEL[role] || role}</div>
            </div>
          </button>

          {menuOpen ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setMenuOpen(false)}
                aria-hidden
              />
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-border bg-card p-1 text-sm shadow-lg">
                <div className="border-b border-border px-3 py-2">
                  <div className="font-medium">{user?.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-3 py-2 hover:bg-muted"
                >
                  <User className="h-4 w-4" /> Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-destructive hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
