/**
 * Doctor — view patients who have booked appointments.
 * Extracts unique patients from the doctor's appointment history.
 */
import { useEffect, useMemo, useState } from 'react';
import { Users, Calendar, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import appointmentService from '@/services/appointmentService';
import { statusVariant, formatApptDate } from '@/utils/appointmentHelpers';

export default function DoctorPatients() {
  usePageTitle('My Patients');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    appointmentService
      .list({})
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  // Extract unique patients from appointments
  const patients = useMemo(() => {
    const map = new Map();
    appointments.forEach((a) => {
      const p = a.patientId || a.patient;
      if (!p || !p._id) return;
      const userId = p.userId?._id || p.userId;
      if (!map.has(userId)) {
        map.set(userId, {
          _id: p._id,
          userId,
          name: p.userId?.name || p.name || 'Unknown',
          email: p.userId?.email || p.email || '',
          phone: p.userId?.phone || p.phone || '',
          gender: p.gender || '',
          address: p.address || '',
          lastVisit: a.date,
          totalAppointments: 0,
        });
      }
      const entry = map.get(userId);
      entry.totalAppointments++;
      if (new Date(a.date) > new Date(entry.lastVisit)) {
        entry.lastVisit = a.date;
      }
    });
    return Array.from(map.values());
  }, [appointments]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    );
  }, [patients, search]);

  // Appointments for selected patient
  const patientAppts = useMemo(() => {
    if (!selectedPatient) return [];
    return appointments.filter((a) => {
      const p = a.patientId || a.patient;
      if (!p) return false;
      const uid = p.userId?._id || p.userId;
      return uid === selectedPatient.userId;
    });
  }, [selectedPatient, appointments]);

  if (loading) return <DashboardLayout><Loading /></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader
        title={selectedPatient ? `Patient: ${selectedPatient.name}` : 'My Patients'}
        description={selectedPatient ? 'Appointment history for this patient.' : 'Patients who have consulted with you.'}
        icon={Users}
      >
        {selectedPatient && (
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={() => setSelectedPatient(null)}
          >
            &larr; Back to all patients
          </button>
        )}
      </PageHeader>

      {selectedPatient ? (
        // Patient detail view - appointment history
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Patient info</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <span className="text-muted-foreground">Name:</span>{' '}
                <span className="font-medium">{selectedPatient.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{' '}
                <span>{selectedPatient.email || '—'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>{' '}
                <span>{selectedPatient.phone || '—'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Gender:</span>{' '}
                <span>{selectedPatient.gender || '—'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total visits:</span>{' '}
                <span>{selectedPatient.totalAppointments}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Last visit:</span>{' '}
                <span>{formatApptDate(selectedPatient.lastVisit)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientAppts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  patientAppts.map((a) => (
                    <TableRow key={a._id}>
                      <TableCell>{formatApptDate(a.date)}</TableCell>
                      <TableCell>{a.timeSlot}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{a.reason || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {a.notes || '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        // Patient list view
        <>
          <div className="mb-4 sm:max-w-xs">
            <Input
              placeholder="Search patients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="No patients yet" description="Patients will appear here after they book appointments." />
          ) : (
            <div className="rounded-lg border border-border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Visits</TableHead>
                    <TableHead>Last visit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.userId || p._id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground">{p.email || '—'}</TableCell>
                      <TableCell>{p.phone || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="info">{p.totalAppointments}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatApptDate(p.lastVisit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          onClick={() => setSelectedPatient(p)}
                        >
                          <FileText className="h-3 w-3" /> View history
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
