/**
 * Patient — my reviews + submit new doctor/product reviews.
 */
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import StarRating from '@/components/shared/StarRating';
import ReviewFormDialog from '@/components/reviews/ReviewFormDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageTitle } from '@/hooks/usePageTitle';
import reviewService from '@/services/reviewService';
import appointmentService from '@/services/appointmentService';
import orderService from '@/services/orderService';

export default function PatientReviews() {
  usePageTitle('My Reviews');
  const [reviews, setReviews] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      reviewService.mine(),
      appointmentService.list({ status: 'completed' }),
      orderService.list({ status: 'delivered' }),
    ])
      .then(([mine, appts, ords]) => {
        setReviews(mine);
        setAppointments(appts);
        setOrders(ords);
      })
      .catch((e) => toast.error(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const reviewedDoctorIds = new Set(
    reviews.filter((r) => r.targetType === 'doctor').map((r) => r.targetId?.toString())
  );
  const reviewedProductIds = new Set(
    reviews.filter((r) => r.targetType === 'product').map((r) => r.targetId?.toString())
  );

  const reviewableDoctors = appointments
    .filter((a) => a.doctorId && !reviewedDoctorIds.has(a.doctorId._id?.toString() || a.doctorId.toString()))
    .map((a) => ({
      appointmentId: a._id,
      doctorId: a.doctorId._id || a.doctorId,
      name: a.doctorId?.userId?.name || a.doctor?.userId?.name || 'Doctor',
    }));

  const reviewableProducts = [];
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      const pid = item.productId?._id || item.productId;
      if (pid && !reviewedProductIds.has(pid.toString())) {
        reviewableProducts.push({
          productId: pid,
          name: item.name || item.productId?.name || 'Product',
        });
      }
    });
  });

  const uniqueProducts = [...new Map(reviewableProducts.map((p) => [p.productId.toString(), p])).values()];

  return (
    <DashboardLayout>
      <PageHeader title="Reviews" description="Rate doctors and products you've used." icon={Star} />

      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-6">
          {(reviewableDoctors.length > 0 || uniqueProducts.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Leave a review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reviewableDoctors.map((d) => (
                  <div key={d.doctorId} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">Doctor · after completed visit</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        setDialog({
                          targetType: 'doctor',
                          targetId: d.doctorId,
                          targetLabel: d.name,
                          appointmentId: d.appointmentId,
                        })
                      }
                    >
                      Review
                    </Button>
                  </div>
                ))}
                {uniqueProducts.map((p) => (
                  <div key={p.productId} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Product · delivered order</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        setDialog({
                          targetType: 'product',
                          targetId: p.productId,
                          targetLabel: p.name,
                        })
                      }
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <EmptyState title="No reviews yet" description="Complete a visit or receive a delivery to leave one." />
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r._id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline">{r.targetType}</Badge>
                        <StarRating value={r.rating} readOnly size="sm" />
                      </div>
                      {r.comment ? <p className="mt-2 text-sm">{r.comment}</p> : null}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {dialog ? (
        <ReviewFormDialog
          open={Boolean(dialog)}
          onOpenChange={(v) => !v && setDialog(null)}
          {...dialog}
          onSuccess={load}
        />
      ) : null}
    </DashboardLayout>
  );
}
