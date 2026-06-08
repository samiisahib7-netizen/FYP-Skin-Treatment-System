/**
 * Doctor — create prescription for a completed appointment.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageTitle } from '@/hooks/usePageTitle';
import appointmentService from '@/services/appointmentService';
import prescriptionService from '@/services/prescriptionService';
import { prescriptionSchema } from '@/utils/validators';
import { formatApptDate, patientName } from '@/utils/appointmentHelpers';

export default function NewPrescription() {
  usePageTitle('New Prescription');
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      appointmentId: '',
      medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
      advice: '',
      followUpDate: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'medicines' });

  useEffect(() => {
    appointmentService
      .list({ status: 'completed' })
      .then(setAppointments)
      .catch((e) => toast.error(e.message || 'Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await prescriptionService.create({
        appointmentId: values.appointmentId,
        medicines: values.medicines,
        advice: values.advice,
        followUpDate: values.followUpDate || null,
      });
      toast.success('Prescription created');
      navigate('/doctor/prescriptions');
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loading variant="fullscreen" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader title="New prescription" description="Issue medicines after a completed consultation." icon={Pill} />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Prescription form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Completed appointment</Label>
              <Select {...register('appointmentId')} defaultValue="">
                <option value="">Select appointment</option>
                {appointments.map((a) => (
                  <option key={a._id} value={a._id}>
                    {patientName(a)} — {formatApptDate(a.date)} {a.timeSlot}
                  </option>
                ))}
              </Select>
              {errors.appointmentId ? (
                <p className="text-sm text-destructive">{errors.appointmentId.message}</p>
              ) : null}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Medicines</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', dosage: '', duration: '', instructions: '' })}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-2">
                  <Input placeholder="Medicine name" {...register(`medicines.${index}.name`)} />
                  <Input placeholder="Dosage" {...register(`medicines.${index}.dosage`)} />
                  <Input placeholder="Duration" {...register(`medicines.${index}.duration`)} />
                  <Input placeholder="Instructions" {...register(`medicines.${index}.instructions`)} />
                  {fields.length > 1 ? (
                    <Button type="button" variant="ghost" size="sm" className="sm:col-span-2" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  ) : null}
                </div>
              ))}
              {errors.medicines?.message ? (
                <p className="text-sm text-destructive">{errors.medicines.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>Advice</Label>
              <Textarea placeholder="General care instructions" {...register('advice')} />
            </div>

            <div className="space-y-2">
              <Label>Follow-up date (optional)</Label>
              <input
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('followUpDate')}
              />
            </div>

            <Button type="submit" disabled={submitting || appointments.length === 0}>
              {submitting ? 'Saving…' : 'Issue prescription'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
