/**
 * Register page — patients can self-register.
 * Doctors and riders are added by Admin (see Module 3).
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

import { useAuth } from '@/hooks/useAuth';
import { registerSchema } from '@/utils/validators';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, homePath } = useAuth();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    try {
      const { confirmPassword, ...payload } = values;
      const user = await registerUser(payload);
      toast.success(`Account created. Welcome, ${user.name}!`);
      navigate(homePath || '/patient', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up as a patient to book appointments and shop skincare."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" placeholder="Mahrukh J." {...register('name')} aria-invalid={!!errors.name} />
          {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
        </div>

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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPwd ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 chars, A-z, 0-9"
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

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Re-enter password"
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          <UserPlus className="h-4 w-4" />
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>

        <Card className="bg-muted/40">
          <CardContent className="p-3 text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Doctors and riders are onboarded by
            the Admin. If you are a healthcare professional, please contact the administrator.
          </CardContent>
        </Card>
      </form>
    </AuthLayout>
  );
}
