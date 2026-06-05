/**
 * AuthLayout — split-screen layout for unauthenticated pages.
 * Brand panel on the left, form panel on the right.
 */
import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-teal-900 p-12 text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="text-2xl">🩺</span>
          <span>Skin Treatment</span>
        </Link>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Your skin deserves expert care — anytime, anywhere.
          </h2>
          <p className="max-w-md text-sm text-teal-50/90">
            Book certified dermatologists, manage digital prescriptions, access reports, and
            order trusted skincare products — all from one secure platform.
          </p>
          <ul className="space-y-2 text-sm text-teal-50/90">
            <li>✓ Verified dermatologists</li>
            <li>✓ Secure medical records</li>
            <li>✓ Home delivery of skincare</li>
          </ul>
        </div>

        <p className="text-xs text-teal-50/70">© 2026 Skin Treatment. FYP Project.</p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <header className="space-y-1 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:hidden">
              <span>🩺</span> Skin Treatment
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </header>

          {children}

          {footer ? <div className="text-center text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}
