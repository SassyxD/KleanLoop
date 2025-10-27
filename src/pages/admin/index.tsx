import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  LogOut,
  Package,
  ShoppingCart,
  TrendingUp,
  Database,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
} from 'lucide-react';
import { api } from '~/utils/api';
import { formatCurrency, formatDate } from '~/lib/utils';
import toast from 'react-hot-toast';

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: transactions, refetch: refetchTransactions } = api.transaction.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: credits, refetch: refetchCredits } = api.credit.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const approveMutation = api.transaction.approve.useMutation({
    onSuccess: () => {
      toast.success('อนุมัติรายการสำเร็จ');
      void refetchTransactions();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = api.transaction.reject.useMutation({
    onSuccess: () => {
      toast.success('ปฏิเสธรายการสำเร็จ');
      void refetchTransactions();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const adminAuth = getCookie('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; max-age=0';
    router.push('/admin/login');
  };

  const handleResetDatabase = async () => {
    if (!confirm('⚠️ คุณแน่ใจหรือไม่ที่จะรีเซ็ตฐานข้อมูล? การกระทำนี้ไม่สามารถย้อนกลับได้!')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/reset-db', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('รีเซ็ตฐานข้อมูลสำเร็จ กำลัง reload...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error('เกิดข้อผิดพลาดในการรีเซ็ตฐานข้อมูล');
      }
    } catch (error) {
      toast.error('ไม่สามารถรีเซ็ตฐานข้อมูลได้');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-transparent" />
      </div>
    );
  }

  const pendingTransactions = transactions?.filter((t) => t.status === 'pending') || [];
  const completedTransactions = transactions?.filter((t) => t.status === 'completed') || [];
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <>
      <Head>
        <title>Admin Dashboard - KleanLoop</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white shadow-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">ระบบจัดการ KleanLoop</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetDatabase}
                className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600"
              >
                <Database className="h-4 w-4" />
                <span>Reset DB</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-2xl bg-gray-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white p-6 shadow-soft"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-sm text-gray-600">รอดำเนินการ</p>
              <p className="text-3xl font-bold text-gray-800">{pendingTransactions.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-white p-6 shadow-soft"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <p className="text-sm text-gray-600">สำเร็จแล้ว</p>
              <p className="text-3xl font-bold text-gray-800">{completedTransactions.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl bg-white p-6 shadow-soft"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <p className="text-sm text-gray-600">รายได้รวม</p>
              <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-white p-6 shadow-soft"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10">
                <ShoppingCart className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600">Credits ที่ขาย</p>
              <p className="text-3xl font-bold text-gray-800">{credits?.length || 0}</p>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pending Transactions */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">🚚 รายการขายรอรับของ</h2>
              <div className="space-y-3">
                {pendingTransactions.length === 0 ? (
                  <div className="rounded-3xl bg-white p-8 text-center text-gray-500 shadow-soft">
                    ไม่มีรายการรอดำเนินการ
                  </div>
                ) : (
                  pendingTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl bg-white p-4 shadow-soft"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">
                            ID: #{transaction.id} - {transaction.plasticType}
                          </p>
                          <p className="text-sm text-gray-600">
                            {transaction.weight} kg · {formatCurrency(transaction.totalAmount)}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          รอดำเนินการ
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveMutation.mutate({ id: transaction.id })}
                          disabled={approveMutation.isPending}
                          className="flex-1 rounded-2xl bg-success py-2 text-sm font-semibold text-white transition-all hover:bg-success/90 disabled:opacity-50"
                        >
                          ✅ อนุมัติ
                        </button>
                        <button
                          onClick={() => rejectMutation.mutate({ id: transaction.id })}
                          disabled={rejectMutation.isPending}
                          className="flex-1 rounded-2xl bg-red-500 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-50"
                        >
                          ❌ ปฏิเสธ
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Credit Purchases Monitor */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">💳 การซื้อ Plastic Credits</h2>
              <div className="space-y-3">
                {!credits || credits.length === 0 ? (
                  <div className="rounded-3xl bg-white p-8 text-center text-gray-500 shadow-soft">
                    ยังไม่มีการซื้อ Credits
                  </div>
                ) : (
                  credits.slice(0, 10).map((credit) => (
                    <motion.div
                      key={credit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-3xl bg-white p-4 shadow-soft"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {credit.amount.toLocaleString()} kg Credits
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(credit.totalPrice)} · {credit.pricePerCredit}฿/credit
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(credit.createdAt)}</p>
                        </div>
                        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                          สำเร็จ
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
