/**
 * Login page.
 * - React Hook Form + Zod validation
 * - Calls useAuth().login() (mock or real depending on VITE_USE_MOCK)
 * - On success, redirects to the page the user came from, or to their role home
 */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/utils/validators';
import { MOCK_CREDENTIALS } from '@/services/mock/auth.mock';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, homePath } = useAuth();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name}!`);
      const redirectTo = location.state?.from?.pathname || homePath;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const fillMock = (creds) => {
    setValue('email', creds.email);
    setValue('password', creds.password);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Skin Treatment account"
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPwd ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          <LogIn className="h-4 w-4" />
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>

        {/* Mock-mode helper: quick-fill credentials for the demo */}
        {import.meta.env.VITE_USE_MOCK !== 'false' && (
          <div className="rounded-md border border-dashed border-border bg-muted/30 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Demo accounts (mock mode):
            </p>
            <div className="flex flex-wrap gap-2">
              {MOCK_CREDENTIALS.map((c) => (
                <button
                  key={c.role}
                  type="button"
                  onClick={() => fillMock(c)}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent"
                >
                  {c.role}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
