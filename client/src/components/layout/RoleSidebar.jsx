/**
 * RoleSidebar — vertical nav rendered inside DashboardLayout.
 * Shows different links per role (see nav.config.js).
 */
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getNavForRole } from './nav.config';

export default function RoleSidebar({ role, onNavigate }) {
  const links = getNavForRole(role);

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-white md:block">
      <nav className="sticky top-16 space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <link.icon className="h-4 w-4" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
