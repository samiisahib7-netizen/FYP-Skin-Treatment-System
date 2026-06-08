/**
 * Patient — view prescriptions issued by doctors.
 */
import { useEffect, useState } from 'react';
import { Pill } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { usePageTitle } from '@/hooks/usePageTitle';
import prescriptionService from '@/services/prescriptionService';

export default function PatientPrescriptions() {
  usePageTitle('Prescriptions');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    prescriptionService
      .list()
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load prescriptions'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title="Prescriptions" description="Digital prescriptions from your dermatologist." icon={Pill} />

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No prescriptions yet" description="Prescriptions appear after a completed consultation." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((rx) => (
            <Card key={rx._id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {rx.doctorId?.userId?.name || 'Doctor'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {rx.medicines?.length || 0} medicine(s) ·{' '}
                  {new Date(rx.issuedAt || rx.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{rx.advice || 'No additional advice.'}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setSelected(rx)}>
                  View details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
        title="Prescription details"
        description={selected ? `Issued ${new Date(selected.issuedAt || selected.createdAt).toLocaleDateString()}` : ''}
      >
        {selected ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Medicines</p>
              <ul className="mt-2 space-y-2">
                {selected.medicines?.map((m, i) => (
                  <li key={i} className="rounded-md border border-border p-3 text-sm">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-muted-foreground">
                      {[m.dosage, m.duration, m.instructions].filter(Boolean).join(' · ')}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            {selected.advice ? (
              <div>
                <p className="text-sm font-medium">Advice</p>
                <p className="mt-1 text-sm text-muted-foreground">{selected.advice}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Dialog>
    </DashboardLayout>
  );
}
