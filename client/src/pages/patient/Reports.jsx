/**
 * Patient — medical reports and lab results.
 */
import { useEffect, useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import reportService from '@/services/reportService';

export default function PatientReports() {
  usePageTitle('Medical Reports');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService
      .list()
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title="Medical Reports" description="Lab results and reports shared by your care team." icon={FileText} />

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState title="No reports yet" description="Reports uploaded by your doctor will appear here." />
      ) : (
        <div className="rounded-lg border border-border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Uploaded by</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.uploadedBy?.name || '—'}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.fileType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <a href={reportService.fileUrl(r.fileUrl)} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" /> Open
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </DashboardLayout>
  );
}
