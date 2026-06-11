import { useState } from 'react';
import toast from 'react-hot-toast';

import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/shared/StarRating';
import reviewService from '@/services/reviewService';

export default function ReviewFormDialog({
  open,
  onOpenChange,
  targetType,
  targetId,
  targetLabel,
  appointmentId,
  onSuccess,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewService.create({
        targetType,
        targetId,
        rating,
        comment,
        appointmentId: appointmentId || undefined,
      });
      toast.success('Review submitted — thank you!');
      onOpenChange(false);
      setComment('');
      setRating(5);
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Review ${targetLabel || 'item'}`}
      description="Share your experience to help others."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Rating</p>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Comment (optional)</p>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience…"
            rows={4}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit review'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
