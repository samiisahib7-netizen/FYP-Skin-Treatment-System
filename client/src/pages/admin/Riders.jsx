/**
 * Admin — manage riders.
 * List, create, edit, delete delivery rider profiles.
 */
import { useEffect, useState } from 'react';
import { Truck, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import riderService from '@/services/riderService';

const EMPTY_RIDER = {
  name: '', email: '', password: '', phone: '',
  vehicleNo: '', area: '',
};

export default function AdminRiders() {
  usePageTitle('Manage Riders');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_RIDER });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    riderService
      .list()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_RIDER });
    setOpen(true);
  };

  const openEdit = (item) => {
    const r = item.rider || {};
    setEditing(item);
    setForm({
      name: item.name || '',
      email: item.email || '',
      password: '',
      phone: item.phone || '',
      vehicleNo: r.vehicleNo || '',
      area: r.area || '',
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
      if (editing) {
        const riderId = editing.rider?._id || editing._id;
        await riderService.update(riderId, form);
        toast.success('Rider updated');
      } else {
        await riderService.create(form);
        toast.success('Rider created');
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
    const name = item.name || 'this rider';
    if (!window.confirm(`Delete rider "${name}"? This action cannot be undone.`)) return;
    try {
      const riderId = item.rider?._id || item._id;
      await riderService.delete(riderId);
      toast.success('Rider deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Riders" description="Manage delivery riders." icon={Truck}>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add rider
        </Button>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No riders yet" description="Add delivery riders to assign orders." actionLabel="Add rider" onAction={openCreate} />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Vehicle No.</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const r = item.rider || {};
                return (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.email}</TableCell>
                    <TableCell>{item.phone || '—'}</TableCell>
                    <TableCell>{r.vehicleNo || '—'}</TableCell>
                    <TableCell>{r.area || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={r.isAvailable !== false ? 'success' : 'secondary'}>
                        {r.isAvailable !== false ? 'Available' : 'Busy'}
                      </Badge>
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
        title={editing ? 'Edit rider' : 'New rider'}
        description={editing ? 'Update rider details.' : 'Add a new delivery rider.'}
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
              <Label>Vehicle number</Label>
              <Input name="vehicleNo" value={form.vehicleNo} onChange={handleChange} placeholder="e.g. LEA-1234" />
            </div>
            <div className="space-y-2">
              <Label>Service area</Label>
              <Input name="area" value={form.area} onChange={handleChange} placeholder="e.g. Sheikhupura City" />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editing ? 'Update rider' : 'Create rider'}
          </Button>
        </form>
      </Dialog>
    </DashboardLayout>
  );
}
