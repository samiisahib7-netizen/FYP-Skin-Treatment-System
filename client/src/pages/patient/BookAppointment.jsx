/**
 * Patient — book a new appointment (doctor → date → slot → reason).
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarPlus } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageTitle } from '@/hooks/usePageTitle';
import doctorService from '@/services/doctorService';
import appointmentService from '@/services/appointmentService';
import { bookAppointmentSchema } from '@/utils/validators';
import { dayLabelFromDate, slotLabel } from '@/utils/appointmentHelpers';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

const MOCK_DOCTORS = [
  {
    _id: 'd1',
    name: 'Dr. Ayesha Khan',
    doctor: {
      _id: 'd1',
      specialization: 'Dermatologist',
      consultationFee: 2000,
      availability: [
        { day: 'Mon', slots: [{ start: '10:00', end: '10:30' }, { start: '10:30', end: '11:00' }] },
        { day: 'Wed', slots: [{ start: '09:00', end: '09:30' }, { start: '15:00', end: '15:30' }] },
      ],
    },
  },
];

export default function BookAppointment() {
  usePageTitle('Book Appointment');
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: { doctorId: '', date: '', timeSlot: '', reason: '' },
  });

  const doctorId = watch('doctorId');
  const date = watch('date');

  useEffect(() => {
    const load = async () => {
      try {
        if (USE_MOCK) {
          setDoctors(MOCK_DOCTORS);
        } else {
          const data = await doctorService.list();
          setDoctors(data);
        }
      } catch (e) {
        toast.error(e.message || 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedDoctor = useMemo(
    () => doctors.find((d) => (d.doctor?._id || d._id) === doctorId),
    [doctors, doctorId]
  );

  useEffect(() => {
    if (!doctorId || !date || USE_MOCK) {
      setBookedSlots([]);
      return;
    }
    appointmentService
      .list({ date })
      .then((appts) =>
        setBookedSlots(
          appts
            .filter((a) => {
              const docId = a.doctorId?._id || a.doctorId;
              return String(docId) === String(doctorId) && a.status !== 'cancelled';
            })
            .map((a) => a.timeSlot)
        )
      )
      .catch(() => setBookedSlots([]));
  }, [doctorId, date]);

  const availableSlots = useMemo(() => {
    if (!selectedDoctor || !date) return [];
    const profile = selectedDoctor.doctor || selectedDoctor;
    const day = dayLabelFromDate(date);
    const dayAvail = (profile.availability || []).find((a) => a.day === day);
    if (!dayAvail) return [];
    return dayAvail.slots
      .map((s) => ({ label: slotLabel(s), value: slotLabel(s) }))
      .filter((s) => !bookedSlots.includes(s.value));
  }, [selectedDoctor, date, bookedSlots]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await appointmentService.create({
        doctorId: values.doctorId,
        date: values.date,
        timeSlot: values.timeSlot,
        reason: values.reason,
      });
      toast.success('Appointment booked!');
      navigate('/patient/appointments');
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Booking failed');
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
      <PageHeader
        title="Book appointment"
        description="Choose a dermatologist and an available time slot."
        icon={CalendarPlus}
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Appointment details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorId">Doctor</Label>
              <Select
                id="doctorId"
                value={doctorId}
                onChange={(e) => {
                  setValue('doctorId', e.target.value);
                  setValue('timeSlot', '');
                }}
              >
                <option value="">Select a doctor</option>
                {doctors.map((d) => {
                  const id = d.doctor?._id || d._id;
                  const name = d.name || d.userId?.name;
                  const spec = d.doctor?.specialization || d.specialization;
                  const fee = d.doctor?.consultationFee ?? d.consultationFee;
                  return (
                    <option key={id} value={id}>
                      {name} — {spec} (PKR {fee?.toLocaleString?.() ?? fee})
                    </option>
                  );
                })}
              </Select>
              {errors.doctorId ? <p className="text-sm text-destructive">{errors.doctorId.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <input
                id="date"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                min={new Date().toISOString().slice(0, 10)}
                {...register('date', {
                  onChange: () => setValue('timeSlot', ''),
                })}
              />
              {errors.date ? <p className="text-sm text-destructive">{errors.date.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">Time slot</Label>
              <Select
                id="timeSlot"
                value={watch('timeSlot')}
                onChange={(e) => setValue('timeSlot', e.target.value)}
                disabled={!doctorId || !date || availableSlots.length === 0}
              >
                <option value="">
                  {!doctorId || !date
                    ? 'Select doctor and date first'
                    : availableSlots.length === 0
                      ? 'No slots available'
                      : 'Select a slot'}
                </option>
                {availableSlots.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
              {errors.timeSlot ? <p className="text-sm text-destructive">{errors.timeSlot.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea id="reason" placeholder="Brief description of your concern" {...register('reason')} />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Booking…' : 'Confirm booking'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
