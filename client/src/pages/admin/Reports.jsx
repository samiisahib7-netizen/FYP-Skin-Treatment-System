/**
 * Admin — upload and manage medical reports for patients.
 */
import { useEffect, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import reportService from '@/services/reportService';
import api from '@/services/api';

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

export default function AdminReports() {
  usePageTitle('Reports');
  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ patientId: '', title: '', description: '', file: null });

  const load = () => {
    reportService
      .list()
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load reports'));
  };

  useEffect(() => {
    const init = async () => {
      try {
        load();
        if (!USE_MOCK) {
          const res = await api.get('/patients');
          setPatients(res.data.data || []);
        } else {
          setPatients([{ patient: { _id: 'p1' }, name: 'Test Patient', _id: 'p1' }]);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!form.file || !form.patientId || !form.title) {
      toast.error('Patient, title, and file are required');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('patientId', form.patientId);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('file', form.file);
      await reportService.upload(fd);
      toast.success('Report uploaded');
      setForm({ patientId: '', title: '', description: '', file: null });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Medical Reports" description="Upload and view patient reports." icon={FileText} />

      <Card className="mb-6 max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">Upload report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onUpload} className="space-y-3">
            <div className="space-y-2">
              <Label>Patient</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.patientId}
                onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
              >
                <option value="">Select patient</option>
                {patients.map((p) => {
                  const id = p.patient?._id || p._id;
                  const name = p.name || p.userId?.name;
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>File (PDF or image)</Label>
              <Input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
              />
            </div>
            <Button type="submit" disabled={uploading}>
              <Upload className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <Loading />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.patientId?.userId?.name || '—'}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </DashboardLayout>
  );
}
