/**
 * Notifications inbox — shared by patient and doctor roles.
 */
import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import Loading from '@/components/shared/Loading';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePageTitle } from '@/hooks/usePageTitle';
import notificationService from '@/services/notificationService';

const TYPE_VARIANT = {
  appointment: 'info',
  order: 'success',
  delivery: 'warning',
  general: 'default',
};

export default function Notifications() {
  usePageTitle('Notifications');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    notificationService
      .list(filter === 'unread' ? { unreadOnly: 'true' } : {})
      .then(setItems)
      .catch((e) => toast.error(e.message || 'Failed to load notifications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (e) {
      toast.error(e.message || 'Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All caught up!');
    } catch (e) {
      toast.error(e.message || 'Failed');
    }
  };

  const unread = items.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout>
      <PageHeader title="Notifications" description="System alerts and updates." icon={Bell}>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread {unread > 0 ? `(${unread})` : ''}
          </Button>
          {unread > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          ) : null}
        </div>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <EmptyState
          title="No notifications"
          description={filter === 'unread' ? 'You have read everything.' : 'Alerts will appear here.'}
        />
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div
              key={n._id}
              className={`flex items-start justify-between gap-4 rounded-lg border p-4 ${
                n.isRead ? 'border-border bg-white' : 'border-primary/20 bg-primary/5'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{n.title}</p>
                  <Badge variant={TYPE_VARIANT[n.type] || 'default'}>{n.type}</Badge>
                  {!n.isRead ? <Badge variant="warning">New</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead ? (
                <Button size="sm" variant="outline" onClick={() => markRead(n._id)}>
                  Mark read
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
