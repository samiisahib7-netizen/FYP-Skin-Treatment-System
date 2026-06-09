/**
 * Admin — manage skincare products.
 */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import productService from '@/services/productService';

const EMPTY = { name: '', description: '', category: 'general', price: '', stock: '', brand: '' };

export default function AdminProducts() {
  usePageTitle('Manage Products');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = () => {
    setLoading(true);
    productService
      .list({ isActive: undefined })
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    reset(EMPTY);
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setImageFile(null);
    reset({
      name: p.name,
      description: p.description || '',
      category: p.category || 'general',
      price: p.price,
      stock: p.stock,
      brand: p.brand || '',
    });
    setOpen(true);
  };

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      };
      if (editing) {
        await productService.update(editing._id, payload, imageFile);
        toast.success('Product updated');
      } else {
        await productService.create(payload, imageFile);
        toast.success('Product created');
      }
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Save failed');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      toast.success('Product deleted');
      load();
    } catch (e) {
      toast.error(e.message || 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Products" description="Manage the skincare catalog." icon={Package}>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>PKR {p.price?.toLocaleString()}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    <Badge variant={p.isActive ? 'success' : 'secondary'}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-1 text-right">
                    <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(p._id)}>
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
        title={editing ? 'Edit product' : 'New product'}
        description="Add or update catalog items."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register('name', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register('description')} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input {...register('category')} />
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input {...register('brand')} />
            </div>
            <div className="space-y-2">
              <Label>Price (PKR)</Label>
              <Input type="number" min="0" {...register('price', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input type="number" min="0" {...register('stock', { required: true })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image (optional)</Label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Saving…' : editing ? 'Update' : 'Create'}
          </Button>
        </form>
      </Dialog>
    </DashboardLayout>
  );
}
