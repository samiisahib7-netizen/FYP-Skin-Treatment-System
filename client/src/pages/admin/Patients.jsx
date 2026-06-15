/**
 * Admin — manage patients.
 * List, search, view, edit, delete patient profiles.
 */
import { useEffect, useState } from 'react';
import { Users, Pencil, Trash2, Search } from 'lucide-react';
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
import patientService from '@/services/patientService';

const GENDERS = ['male', 'female', 'other'];

export default function AdminPatients() {
  usePageTitle('Manage Patients');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    dateOfBirth: '', gender: 'male', address: '',
    medicalHistory: '', allergies: '',
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    patientService
      .list(params)
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '', email: '', password: '', phone: '',
      dateOfBirth: '', gender: 'male', address: '',
      medicalHistory: '', allergies: '',
    });
    setOpen(true);
  };

  const openEdit = (item) => {
    const p = item.patient || {};
    setEditing(item);
    setForm({
      name: item.name || '',
      email: item.email || '',
      password: '',
      phone: item.phone || '',
      dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
      gender: p.gender || 'male',
      address: p.address || '',
      medicalHistory: p.medicalHistory || '',
      allergies: Array.isArray(p.allergies) ? p.allergies.join(', ') : (p.allergies || ''),
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
        allergies: form.allergies ? form.allergies.split(',').map((a) => a.trim()).filter(Boolean) : [],
      };

      if (editing) {
        const patientId = editing.patient?._id || editing._id;
        await patientService.update(patientId, payload);
        toast.success('Patient updated');
      } else {
        await patientService.create(payload);
        toast.success('Patient created');
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
    const name = item.name || 'this patient';
    if (!window.confirm(`Delete patient "${name}"? This action cannot be undone.`)) return;
    try {
      const patientId = item.patient?._id || item._id;
      await patientService.delete(patientId);
      toast.success('Patient deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Patients" description="Manage registered patients." icon={Users}>
        <Button onClick={openCreate}>
          <Users className="h-4 w-4" /> Add patient
        </Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          Search
        </Button>
        <span className="text-sm text-muted-foreground">{items.length} patient{items.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No patients found" description="Patients appear after registration." />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const p = item.patient || {};
                return (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.email}</TableCell>
                    <TableCell>{item.phone || '—'}</TableCell>
                    <TableCell>{p.gender || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
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
        title={editing ? 'Edit patient' : 'New patient'}
        description={editing ? 'Update patient information.' : 'Register a new patient.'}
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
              <Label>Date of birth</Label>
              <Input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select name="gender" value={form.gender} onChange={handleChange}>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea name="address" value={form.address} onChange={handleChange} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Medical history</Label>
            <Textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Allergies (comma-separated)</Label>
            <Input name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g. Penicillin, Sulfa" />
          </div>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editing ? 'Update patient' : 'Create patient'}
          </Button>
        </form>
      </Dialog>
    </DashboardLayout>
  );
}
