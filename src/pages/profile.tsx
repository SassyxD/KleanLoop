import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { LogOut, TrendingUp, Award, Package, DollarSign } from 'lucide-react';
import { Layout } from '~/components/Layout';
import { useAuth } from '~/contexts/AuthContext';
import { api } from '~/utils/api';
import { TIER_CONFIG } from '~/lib/tier';
import { formatCurrency, formatDate } from '~/lib/utils';
import toast from 'react-hot-toast';

export default function Profile() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();

  const { data: profile, isLoading } = api.user.getProfile.useQuery(undefined, {
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const tierInfo = TIER_CONFIG[profile.tier as keyof typeof TIER_CONFIG];
  const progress = tierInfo.maxPoints
    ? ((profile.reputationPoints - tierInfo.minPoints) / (tierInfo.maxPoints - tierInfo.minPoints)) * 100
    : 100;

  const handleLogout = () => {
    logout();
    toast.success('ออกจากระบบสำเร็จ');
  };

  return (
    <>
      <Head>
        <title>โปรไฟล์ - KleanLoop</title>
      </Head>

      <Layout userType={user.type} userName={user.name}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">โปรไฟล์</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2 text-white transition-all hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>ออกจากระบบ</span>
            </button>
          </div>

          {/* Personal Profile */}
          {user.type === 'personal' && (
            <div className="space-y-6">
              {/* User Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-br from-accent to-success p-6 text-white shadow-float"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                        <span className="text-3xl">{tierInfo.icon}</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p className="text-white/80">{profile.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/20 px-4 py-2">
                    <p className="text-sm text-white/80">ระดับ</p>
                    <p className="text-xl font-bold">{tierInfo.nameTH}</p>
                  </div>
                </div>

                {/* Reputation Progress */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>คะแนนชื่อเสียง</span>
                    <span className="font-semibold">
                      {profile.reputationPoints.toLocaleString()} คะแนน
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  {tierInfo.maxPoints && (
                    <p className="mt-2 text-sm text-white/80">
                      อีก {tierInfo.maxPoints - profile.reputationPoints} คะแนน ถึงระดับถัดไป
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-3xl bg-white p-6 shadow-soft"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-sm text-gray-600">ยอดขายทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {profile.stats.totalSales} ครั้ง
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-3xl bg-white p-6 shadow-soft"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
                    <Package className="h-6 w-6 text-success" />
                  </div>
                  <p className="text-sm text-gray-600">น้ำหนักรวม</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {profile.stats.totalKg.toFixed(1)} kg
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-3xl bg-white p-6 shadow-soft"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                    <DollarSign className="h-6 w-6 text-amber-500" />
                  </div>
                  <p className="text-sm text-gray-600">รายได้ทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(profile.stats.totalEarnings)}
                  </p>
                </motion.div>
              </div>

              {/* Recent Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl bg-white p-6 shadow-soft"
              >
                <h3 className="mb-4 text-xl font-bold text-gray-800">ประวัติการขายล่าสุด</h3>
                {profile.transactions.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">ยังไม่มีประวัติการขาย</p>
                ) : (
                  <div className="space-y-3">
                    {profile.transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between rounded-2xl border border-gray-100 p-4"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {transaction.plasticType} - {transaction.weight} kg
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-success">
                            {formatCurrency(transaction.totalAmount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.status === 'completed' ? '✅ สำเร็จ' : '⏳ รอดำเนินการ'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Corporate Profile */}
          {user.type === 'corporate' && (
            <div className="space-y-6">
              {/* Company Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-br from-accent to-success p-6 text-white shadow-float"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.companyName || profile.name}</h2>
                    <p className="text-white/80">{profile.email}</p>
                    <p className="mt-2 text-sm text-white/80">บัญชีองค์กร</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl bg-white p-6 shadow-soft"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <p className="text-sm text-gray-600">Plastic Credits ทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-800">
                  {profile.stats.totalCredits.toLocaleString()} kg
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  ช่วยจัดการพลาสติก {profile.stats.totalCredits.toLocaleString()} กิโลกรัม
                </p>
              </motion.div>

              {/* Recent Purchases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl bg-white p-6 shadow-soft"
              >
                <h3 className="mb-4 text-xl font-bold text-gray-800">ประวัติการซื้อ Credits</h3>
                {profile.credits.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">ยังไม่มีประวัติการซื้อ</p>
                ) : (
                  <div className="space-y-3">
                    {profile.credits.slice(0, 5).map((credit) => (
                      <div
                        key={credit.id}
                        className="flex items-center justify-between rounded-2xl border border-gray-100 p-4"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {credit.amount.toLocaleString()} kg Credits
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(credit.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-success">
                            {formatCurrency(credit.totalPrice)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {credit.pricePerCredit}฿/credit
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
