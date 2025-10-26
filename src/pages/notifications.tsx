import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Gift, Truck, AlertCircle, Check, CheckCheck } from 'lucide-react';
import { Layout } from '~/components/Layout';
import { useAuth } from '~/contexts/AuthContext';
import { api } from '~/utils/api';
import { formatCurrency } from '~/lib/utils';
import toast from 'react-hot-toast';

type NotificationType = 'pickup' | 'reward' | 'system';
type FilterType = 'all' | NotificationType;

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'pickup', label: 'รับของ' },
  { value: 'reward', label: 'รางวัล' },
  { value: 'system', label: 'ระบบ' },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'pickup':
      return <Truck className="h-6 w-6 text-accent" />;
    case 'reward':
      return <Gift className="h-6 w-6 text-success" />;
    case 'system':
      return <AlertCircle className="h-6 w-6 text-orange-500" />;
    default:
      return <Bell className="h-6 w-6 text-gray-400" />;
  }
};

const getNotificationBg = (type: NotificationType) => {
  switch (type) {
    case 'pickup':
      return 'bg-accent/10';
    case 'reward':
      return 'bg-success/10';
    case 'system':
      return 'bg-orange-500/10';
    default:
      return 'bg-gray-100';
  }
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} นาทีที่แล้ว`;
  }
  if (diffHours < 24) {
    return `${diffHours} ชั่วโมงที่แล้ว`;
  }
  if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`;
  }
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function Notifications() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [filter, setFilter] = useState<FilterType>('all');

  const { data: notifications, refetch } = api.notification.list.useQuery(
    { filter: filter === 'all' ? undefined : filter },
    { enabled: !!user },
  );

  const markAsReadMutation = api.notification.markAsRead.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const markAllAsReadMutation = api.notification.markAllAsRead.useMutation({
    onSuccess: () => {
      toast.success('ทำเครื่องหมายทั้งหมดแล้ว');
      void refetch();
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate({ id });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length ?? 0;

  return (
    <>
      <Head>
        <title>การแจ้งเตือน - KleanLoop</title>
      </Head>

      <Layout userType={user.type} userName={user.name}>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">การแจ้งเตือน</h1>
              {unreadCount > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  คุณมี {unreadCount} การแจ้งเตือนที่ยังไม่ได้อ่าน
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-accent/90 disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4" />
                <span>อ่านทั้งหมด</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`flex-shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                  filter === option.value
                    ? 'bg-accent text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {!notifications || notifications.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-float">
              <Bell className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-gray-500">ไม่มีการแจ้งเตือน</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {notifications.map((notification: any, index: number) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md ${
                      !notification.isRead ? 'border-l-4 border-accent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div className={`flex-shrink-0 rounded-2xl p-3 ${getNotificationBg(notification.type as NotificationType)}`}>
                        {getNotificationIcon(notification.type as NotificationType)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <h3
                            className={`font-semibold ${
                              notification.isRead ? 'text-gray-700' : 'text-gray-900'
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                          )}
                        </div>
                        <p
                          className={`mb-2 text-sm ${
                            notification.isRead ? 'text-gray-500' : 'text-gray-600'
                          }`}
                        >
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {formatDate(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={markAsReadMutation.isPending}
                              className="flex items-center gap-1 text-xs font-semibold text-accent transition-all hover:text-accent/80 disabled:opacity-50"
                            >
                              <Check className="h-3 w-3" />
                              <span>ทำเครื่องหมายว่าอ่านแล้ว</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
