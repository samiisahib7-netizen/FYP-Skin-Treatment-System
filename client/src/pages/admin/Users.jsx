/**
 * Admin — manage all platform users.
 * List, search, filter by role, create, edit, delete.
 */
import { useEffect, useState } from 'react';
import { Users as UsersIcon, Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import userService from '@/services/userService';

const ROLES = ['admin', 'doctor', 'patient', 'rider'];
const ROLE_VARIANTS = { admin: 'destructive', doctor: 'info', patient: 'default', rider: 'warning' };

const EMPTY_USER = { name: '', email: '', password: '', phone: '', role: 'patient', isActive: true };

export default function AdminUsers() {
  usePageTitle('Manage Users');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [form, setForm] = useState({ ...EMPTY_USER });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const params = { page: 1, limit: 100 };
    if (roleFilter) params.role = roleFilter;
    if (search.trim()) params.search = search.trim();

    userService
      .list(params)
      .then((res) => {
        setItems(res.items || []);
        setTotal(res.total || 0);
      })
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_USER });
    setOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, phone: u.phone || '', role: u.role, isActive: u.isActive, password: '' });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email, phone: form.phone, role: form.role, isActive: form.isActive };
        await userService.update(editing._id, payload);
        toast.success('User updated');
      } else {
        await userService.create(form);
        toast.success('User created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    try {
      await userService.delete(id);
      toast.success('User deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Users" description="Manage all platform accounts." icon={UsersIcon}>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add user
        </Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-36">
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </Select>
        <Button variant="outline" size="sm" onClick={load}>
          Search
        </Button>
        <span className="text-sm text-muted-foreground">{total} user{total !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No users found" description="Try adjusting your search or filters." />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((u) => (
                <TableRow key={u._id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={ROLE_VARIANTS[u.role] || 'default'}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>{u.phone || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={u.isActive ? 'success' : 'destructive'}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-1 text-right">
                    <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(u._id, u.name)}
                      disabled={u.role === 'admin'}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? 'Edit user' : 'New user'}
        description={editing ? 'Update account details.' : 'Create a new platform account.'}
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          {!editing && (
            <div className="space-y-2">
              <Label>Password</Label>
              <Input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select name="role" value={form.role} onChange={handleChange}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {editing && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-border text-primary"
              />
              <Label htmlFor="isActive" className="text-sm font-normal">
                Account active
              </Label>
            </div>
          )}
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editing ? 'Update user' : 'Create user'}
          </Button>
        </form>
      </Dialog>
    </DashboardLayout>
  );
}
