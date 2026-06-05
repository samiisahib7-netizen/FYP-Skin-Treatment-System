/**
 * Forgot Password page — sends a reset link to the user's email.
 * Always returns a generic success message to avoid email-enumeration leaks.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ArrowLeft, MailCheck } from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '@/hooks/useAuth';
import { forgotPasswordSchema } from '@/utils/validators';

export default function ForgotPassword() {
  const { forgotPassword, isLoading } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    try {
      const message = await forgotPassword(values.email);
      setSubmittedEmail(values.email);
      toast.success(message);
    } catch (err) {
      toast.error(err.message || 'Request failed');
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          <ArrowLeft className="h-3 w-3" /> Back to sign in
        </Link>
      }
    >
      {submittedEmail ? (
        <div className="rounded-md border border-border bg-accent/40 p-4 text-sm">
          <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
            <MailCheck className="h-4 w-4 text-primary" />
            Check your email
          </div>
          <p className="text-muted-foreground">
            If an account exists for <span className="font-medium">{submittedEmail}</span>, we have
            sent a password reset link. It may take a minute to arrive.
          </p>
        </div>
      ) : (
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

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
