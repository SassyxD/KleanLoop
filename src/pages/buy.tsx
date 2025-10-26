import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { ShoppingCart, CheckCircle, Download } from 'lucide-react';
import { Layout } from '~/components/Layout';
import { useAuth } from '~/contexts/AuthContext';
import { api } from '~/utils/api';
import { CREDIT_PACKAGES, getCreditCostBreakdown } from '~/lib/pricing';
import { formatCurrency } from '~/lib/utils';
import toast from 'react-hot-toast';

export default function Buy() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const purchaseMutation = api.credit.purchase.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      toast.success('ซื้อ Plastic Credits สำเร็จ!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user?.type !== 'corporate') {
      router.push('/');
      toast.error('เฉพาะบัญชีองค์กรเท่านั้นที่ซื้อ Credits ได้');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user || user.type !== 'corporate') {
    return null;
  }

  const handlePurchase = () => {
    if (selectedPackage === 'custom') {
      const amount = parseInt(customAmount);
      if (!amount || amount < 1) {
        toast.error('กรุณาระบุจำนวนที่ถูกต้อง');
        return;
      }
      purchaseMutation.mutate({ packageId: 'custom', customAmount: amount });
    } else if (selectedPackage) {
      purchaseMutation.mutate({ packageId: selectedPackage });
    }
  };

  const getSelectedPackageInfo = () => {
    if (selectedPackage === 'custom') {
      const amount = parseInt(customAmount) || 0;
      return {
        amount,
        pricePerCredit: 25,
        totalPrice: amount * 25,
      };
    }
    return CREDIT_PACKAGES.find((p) => p.id === selectedPackage);
  };

  const selectedInfo = getSelectedPackageInfo();
  const breakdown = selectedInfo ? getCreditCostBreakdown(selectedInfo.pricePerCredit) : null;

  if (showSuccess) {
    return (
      <>
        <Head>
          <title>ซื้อ Plastic Credits - KleanLoop</title>
        </Head>

        <Layout userType={user.type} userName={user.name}>
          <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl bg-white p-8 text-center shadow-float"
              >
                <CheckCircle className="mx-auto mb-4 h-20 w-20 text-success" />
                <h2 className="mb-2 text-2xl font-bold text-gray-800">
                  ซื้อสำเร็จ!
                </h2>
                <p className="mb-6 text-gray-600">
                  คุณได้รับ Plastic Credits แล้ว<br />
                  ใบรับรองพร้อมดาวน์โหลด
                </p>
                <button
                  onClick={() => {
                    toast.success('กำลังดาวน์โหลดใบรับรอง...');
                  }}
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-success py-3 font-semibold text-white transition-all hover:bg-success/90"
                >
                  <Download className="h-5 w-5" />
                  <span>ดาวน์โหลดใบรับรอง</span>
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full rounded-2xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                >
                  ดูโปรไฟล์
                </button>
              </motion.div>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>ซื้อ Plastic Credits - KleanLoop</title>
      </Head>

      <Layout userType={user.type} userName={user.name}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">ซื้อ Plastic Credits</h1>
          <p className="mb-6 text-gray-600">
            1 Credit = 1 kg พลาสติกที่ถูกจัดการอย่างยั่งยืน
          </p>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Packages */}
            <div className="lg:col-span-2">
              <div className="grid gap-4 md:grid-cols-2">
                {CREDIT_PACKAGES.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`cursor-pointer rounded-3xl border-2 p-6 transition-all ${
                      selectedPackage === pkg.id
                        ? 'border-accent bg-accent/5 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-accent/50'
                    } ${pkg.popular ? 'relative' : ''}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -right-2 -top-2 rounded-full bg-success px-3 py-1 text-xs font-bold text-white">
                        แนะนำ
                      </div>
                    )}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{pkg.nameTH}</h3>
                      <p className="text-3xl font-bold text-accent">{pkg.amount.toLocaleString()} kg</p>
                    </div>
                    <div className="mb-4 space-y-1">
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(pkg.totalPrice)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {pkg.pricePerCredit}฿ ต่อ credit
                      </p>
                      {pkg.savings && (
                        <p className="text-sm font-semibold text-success">
                          ประหยัด {formatCurrency(pkg.savings)}
                        </p>
                      )}
                    </div>
                    {selectedPackage === pkg.id && (
                      <div className="flex items-center gap-2 text-accent">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-semibold">เลือกแล้ว</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Custom Package */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setSelectedPackage('custom')}
                  className={`cursor-pointer rounded-3xl border-2 p-6 transition-all ${
                    selectedPackage === 'custom'
                      ? 'border-accent bg-accent/5 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-accent/50'
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800">แพ็คเกจกำหนดเอง</h3>
                    <p className="text-sm text-gray-600">ระบุจำนวนที่ต้องการ</p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="จำนวน (kg)"
                    className="mb-4 w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  {customAmount && parseInt(customAmount) > 0 && (
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(parseInt(customAmount) * 25)}
                      </p>
                      <p className="text-sm text-gray-600">25฿ ต่อ credit</p>
                    </div>
                  )}
                  {selectedPackage === 'custom' && (
                    <div className="mt-4 flex items-center gap-2 text-accent">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">เลือกแล้ว</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="sticky top-8 rounded-3xl bg-white p-6 shadow-float">
                <h3 className="mb-4 text-xl font-bold text-gray-800">สรุปการสั่งซื้อ</h3>

                {selectedInfo ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">จำนวน</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {selectedInfo.amount.toLocaleString()} kg
                      </p>
                    </div>

                    {breakdown && (
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="mb-3 text-sm font-semibold text-gray-700">
                          รายละเอียดค่าใช้จ่าย (ต่อ credit)
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">ค่าขนส่ง</span>
                            <span>{breakdown.logistics}฿</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">รางวัลครัวเรือน</span>
                            <span>{breakdown.householdReward}฿</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ค่าคัดแยก</span>
                            <span>{breakdown.sorting}฿</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ค่าจัดการ</span>
                            <span>{breakdown.disposal}฿</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">ค่าดำเนินการ</span>
                            <span>{breakdown.admin}฿</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">กำไร</span>
                            <span>{breakdown.margin}฿</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-2 flex justify-between">
                        <span className="text-gray-600">ราคารวม</span>
                        <span className="text-xl font-bold text-gray-800">
                          {formatCurrency(selectedInfo.totalPrice)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handlePurchase}
                      disabled={purchaseMutation.isPending}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-success py-3 font-semibold text-white transition-all hover:bg-success/90 disabled:opacity-50"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>
                        {purchaseMutation.isPending ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <p className="py-8 text-center text-gray-500">
                    เลือกแพ็คเกจที่ต้องการ
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
