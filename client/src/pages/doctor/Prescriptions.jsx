/**
 * Doctor — list of issued prescriptions.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import prescriptionService from '@/services/prescriptionService';

export default function DoctorPrescriptions() {
  const navigate = useNavigate();
  usePageTitle('Prescriptions');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prescriptionService
      .list()
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title="Prescriptions" description="Prescriptions you have issued." icon={Pill}>
        <Button asChild>
          <Link to="/doctor/prescriptions/new">
            <Plus className="h-4 w-4" /> New prescription
          </Link>
        </Button>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState
          title="No prescriptions yet"
          description="Create a prescription after completing an appointment."
          actionLabel="Create prescription"
          onAction={() => navigate('/doctor/prescriptions/new')}
        />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medicines</TableHead>
                <TableHead>Issued</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((rx) => (
                <TableRow key={rx._id}>
                  <TableCell className="font-medium">{rx.patientId?.userId?.name || 'Patient'}</TableCell>
                  <TableCell>{rx.medicines?.length || 0}</TableCell>
                  <TableCell>{new Date(rx.issuedAt || rx.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </DashboardLayout>
  );
}
