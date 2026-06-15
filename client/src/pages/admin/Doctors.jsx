/**
 * Admin — manage doctors.
 * List, search, create, edit, delete doctor profiles.
 */
import { useEffect, useState } from 'react';
import { Stethoscope, Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import doctorService from '@/services/doctorService';

const SPECIALIZATIONS = [
  'General Dermatology',
  'Cosmetic Dermatology',
  'Pediatric Dermatology',
  'Surgical Dermatology',
  'Laser Dermatology',
  'Hair & Nail Disorders',
];

const EMPTY_DOCTOR = {
  name: '', email: '', password: '', phone: '',
  specialization: 'General Dermatology', qualification: '',
  experience: '', consultationFee: '', bio: '',
};

export default function AdminDoctors() {
  usePageTitle('Manage Doctors');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ ...EMPTY_DOCTOR });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    doctorService
      .list(params)
      .then((data) => {
        // Data returns merged user+doctor array
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_DOCTOR });
    setOpen(true);
  };

  const openEdit = (item) => {
    const d = item.doctor || {};
    setEditing(item);
    setForm({
      name: item.name || '',
      email: item.email || '',
      password: '',
      phone: item.phone || '',
      specialization: d.specialization || 'General Dermatology',
      qualification: d.qualification || '',
      experience: d.experience?.toString() || '',
      consultationFee: d.consultationFee?.toString() || '',
      bio: d.bio || '',
    });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        experience: Number(form.experience) || 0,
        consultationFee: Number(form.consultationFee) || 0,
      };

      if (editing) {
        // editing: use doctor update endpoint - needs doctor's _id
        const doctorId = editing.doctor?._id || editing._id;
        await doctorService.update(doctorId, payload);
        toast.success('Doctor updated');
      } else {
        await doctorService.create(payload);
        toast.success('Doctor created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item) => {
    const name = item.name || 'this doctor';
    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return;
    try {
      const doctorId = item.doctor?._id || item._id;
      await doctorService.delete(doctorId);
      toast.success('Doctor deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Doctors" description="Manage dermatologist profiles." icon={Stethoscope}>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add doctor
        </Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          Search
        </Button>
        <span className="text-sm text-muted-foreground">{items.length} doctor{items.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No doctors found" description="Add your first doctor to get started." actionLabel="Add doctor" onAction={openCreate} />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const d = item.doctor || {};
                return (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{d.specialization || '—'}</TableCell>
                    <TableCell>PKR {d.consultationFee?.toLocaleString() || 0}</TableCell>
                    <TableCell>{d.experience || 0} yrs</TableCell>
                    <TableCell>
                      {d.rating ? (
                        <Badge variant="info">{d.rating.toFixed(1)} ({d.totalReviews || 0})</Badge>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="space-x-1 text-right">
                      <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onDelete(item)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? 'Edit doctor' : 'New doctor'}
        description={editing ? 'Update doctor profile and credentials.' : 'Register a new dermatologist.'}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} required={!editing} readOnly={!!editing} />
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label>Password</Label>
                <Input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Select name="specialization" value={form.specialization} onChange={handleChange}>
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Qualification</Label>
              <Input name="qualification" value={form.qualification} onChange={handleChange} placeholder="MBBS, FCPS Dermatology" />
            </div>
            <div className="space-y-2">
              <Label>Experience (years)</Label>
              <Input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Consultation fee (PKR)</Label>
              <Input name="consultationFee" type="number" min="0" value={form.consultationFee} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio / Description</Label>
            <Textarea name="bio" value={form.bio} onChange={handleChange} rows={3} />
          </div>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editing ? 'Update doctor' : 'Create doctor'}
          </Button>
        </form>
      </Dialog>
    </DashboardLayout>
  );
}
