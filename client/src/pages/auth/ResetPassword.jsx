/**
 * Reset Password page — sets a new password using a token from the email link.
 * Token comes from URL: /reset-password/:token
 */
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, KeyRound } from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '@/hooks/useAuth';
import { resetPasswordSchema } from '@/utils/validators';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values) => {
    try {
      const message = await resetPassword(token, values.password);
      toast.success(message || 'Password updated.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Reset failed');
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password you don't reuse anywhere else."
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
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
          <Label htmlFor="confirmPassword">Confirm new password</Label>
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
          <KeyRound className="h-4 w-4" />
          {isLoading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  );
}
