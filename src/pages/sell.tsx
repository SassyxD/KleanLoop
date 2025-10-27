import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scale, CheckCircle, Upload, X } from 'lucide-react';
import { Layout } from '~/components/Layout';
import { useAuth } from '~/contexts/AuthContext';
import { api } from '~/utils/api';
import { TIER_CONFIG } from '~/lib/tier';
import { PLASTIC_PRICES, calculatePrice } from '~/lib/pricing';
import { formatCurrency } from '~/lib/utils';
import toast from 'react-hot-toast';

type Step = 1 | 2 | 3 | 4;

export default function Sell() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [detectedType, setDetectedType] = useState<keyof typeof PLASTIC_PRICES>('PET');
  const [selectedType, setSelectedType] = useState<keyof typeof PLASTIC_PRICES>('PET');

  const createOrderMutation = api.transaction.createSellOrder.useMutation({
    onSuccess: () => {
      setStep(4);
      toast.success('สร้างคำสั่งขายสำเร็จ!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user?.type !== 'personal') {
      router.push('/');
      toast.error('เฉพาะบัญชีส่วนบุคคลเท่านั้นที่ขายได้');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user || user.type !== 'personal') {
    return null;
  }

  const tierInfo = TIER_CONFIG[user.tier as keyof typeof TIER_CONFIG];
  const weightNum = parseFloat(weight) || 0;
  const pricing = weightNum > 0 ? calculatePrice(detectedType, weightNum, tierInfo.priceMultiplier) : null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        // Mock AI detection
        const types: Array<keyof typeof PLASTIC_PRICES> = ['PET', 'HDPE', 'LDPE', 'PP'];
        setDetectedType(types[Math.floor(Math.random() * types.length)]);
        setSelectedType(types[Math.floor(Math.random() * types.length)]);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWeightSubmit = () => {
    if (weightNum < tierInfo.minWeight) {
      toast.error(`น้ำหนักขั้นต่ำสำหรับระดับ ${tierInfo.nameTH} คือ ${tierInfo.minWeight} kg`);
      return;
    }
    setStep(3);
  };

  const handleConfirm = () => {
    // upload image to server first to avoid sending large base64 over tRPC
    (async () => {
      try {
        let photoUrl = '';
        if (photoPreview) {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: photoPreview }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || 'Upload failed');
          photoUrl = data.url;
        }

        createOrderMutation.mutate({
          weight: weightNum,
          photoUrl,
          plasticType: selectedType,
        });
      } catch (err: any) {
        toast.error(err?.message || 'การอัปโหลดรูปผิดพลาด');
      }
    })();
  };

  const resetForm = () => {
    setStep(1);
    setPhotoPreview(null);
    setWeight('');
  };

  return (
    <>
      <Head>
        <title>ขายพลาสติก - KleanLoop</title>
      </Head>

      <Layout userType={user.type} userName={user.name}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">ขายพลาสติกรีไซเคิล</h1>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                    s <= step
                      ? 'bg-accent text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-1 w-8 transition-all md:w-16 ${
                      s < step ? 'bg-accent' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Upload Photo */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mx-auto max-w-lg"
              >
                <div className="rounded-3xl bg-white p-8 shadow-float">
                  <div className="mb-6 text-center">
                    <Camera className="mx-auto mb-4 h-16 w-16 text-accent" />
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                      อัปโหลดรูปพลาสติก
                    </h2>
                    <p className="text-gray-600">
                      ถ่ายรูปพลาสติกที่ต้องการขาย
                    </p>
                  </div>

                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 py-8 transition-all hover:border-accent hover:bg-accent/10">
                      <Upload className="h-6 w-6 text-accent" />
                      <span className="font-semibold text-accent">เลือกรูปภาพ</span>
                    </div>
                  </label>

                  <p className="mt-4 text-center text-sm text-gray-500">
                    รองรับไฟล์: JPG, PNG
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Enter Weight */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mx-auto max-w-lg"
              >
                <div className="rounded-3xl bg-white p-8 shadow-float">
                  {photoPreview && (
                    <div className="mb-6">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-48 w-full rounded-2xl object-cover"
                      />
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center justify-between rounded-2xl bg-accent/10 p-3">
                          <span className="text-sm text-gray-700">ตรวจพบ:</span>
                          <span className="font-semibold text-accent">
                            {PLASTIC_PRICES[detectedType].nameTH}
                          </span>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">เลือกประเภทวัสดุ (หากไม่ตรง)</label>
                          <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(PLASTIC_PRICES) as Array<keyof typeof PLASTIC_PRICES>).map((k) => (
                              <button
                                key={k}
                                onClick={() => setSelectedType(k)}
                                className={`rounded-2xl border px-3 py-2 text-sm transition-all ${
                                  selectedType === k ? 'bg-accent text-white' : 'bg-white hover:bg-gray-50'
                                }`}
                              >
                                {PLASTIC_PRICES[k].nameTH}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-6 text-center">
                    <Scale className="mx-auto mb-4 h-16 w-16 text-accent" />
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                      ระบุน้ำหนัก
                    </h2>
                    <p className="text-gray-600">
                      น้ำหนักขั้นต่ำ: {tierInfo.minWeight} kg
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      น้ำหนัก (กิโลกรัม)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={tierInfo.minWeight}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="0.0"
                    />
                  </div>

                  {pricing && (
                    <div className="mb-6 rounded-2xl bg-success/10 p-4">
                      <p className="text-sm text-gray-700">ราคาโดยประมาณ</p>
                      <p className="text-3xl font-bold text-success">
                        {formatCurrency(pricing.total)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={resetForm}
                      className="flex-1 rounded-2xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleWeightSubmit}
                      disabled={!weightNum || weightNum < tierInfo.minWeight}
                      className="flex-1 rounded-2xl bg-accent py-3 font-semibold text-white transition-all hover:bg-accent/90 disabled:opacity-50"
                    >
                      ถัดไป
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && pricing && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mx-auto max-w-lg"
              >
                <div className="rounded-3xl bg-white p-8 shadow-float">
                  <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">ยืนยันการขาย</h2>

                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="mb-4 h-32 w-full rounded-2xl object-cover"
                    />
                  )}

                  <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ประเภท:</span>
                      <span className="font-semibold">{PLASTIC_PRICES[selectedType].nameTH}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">น้ำหนัก:</span>
                      <span className="font-semibold">{weightNum} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ราคาพื้นฐาน:</span>
                      <span className="font-semibold">{formatCurrency(pricing.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">โบนัสระดับ ({tierInfo.nameTH}):</span>
                      <span className="font-semibold text-success">+{formatCurrency(pricing.tierBonus)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ค่าบริการ:</span>
                      <span className="font-semibold text-red-500">-{formatCurrency(pricing.serviceFee)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-800">รวม:</span>
                        <span className="text-2xl font-bold text-success">{formatCurrency(pricing.total)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mb-6 text-center text-sm text-gray-600">
                    ⏱️ เวลารับโดยประมาณ: 2-3 ชั่วโมง
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-2xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={createOrderMutation.isPending}
                      className="flex-1 rounded-2xl bg-success py-3 font-semibold text-white transition-all hover:bg-success/90 disabled:opacity-50"
                    >
                      {createOrderMutation.isPending ? 'กำลังสร้าง...' : 'ยืนยัน'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-lg"
              >
                <div className="rounded-3xl bg-white p-8 text-center shadow-float">
                  <CheckCircle className="mx-auto mb-4 h-20 w-20 text-success" />
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">
                    สำเร็จ!
                  </h2>
                  <p className="mb-6 text-gray-600">
                    พนักงานกำลังเดินทางไปรับของ<br />
                    ประมาณ 2-3 ชั่วโมง
                  </p>
                  <button
                    onClick={() => router.push('/notifications')}
                    className="w-full rounded-2xl bg-accent py-3 font-semibold text-white transition-all hover:bg-accent/90"
                  >
                    ดูสถานะ
                  </button>
                  <button
                    onClick={resetForm}
                    className="mt-3 w-full rounded-2xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                  >
                    ขายอีกครั้ง
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Layout>
    </>
  );
}
