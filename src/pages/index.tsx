import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '~/components/Layout';
import { useAuth } from '~/contexts/AuthContext';
import { motion } from 'framer-motion';

const SELL_PROMOS = [
  { id: 'p1', title: 'โปรเพิ่มราคาพิเศษสำหรับ PET', desc: 'รับเพิ่ม 2฿/kg เมื่อขาย PET ในสัปดาห์นี้', bonus: 2 },
  { id: 'p2', title: 'โปรแพ็คใหญ่', desc: 'รับเพิ่ม 5% เมื่อขายตั้งแต่ 100 kg ขึ้นไป', bonusPercent: 5 },
];

const CREDIT_PROMOS = [
  { id: 'c1', title: 'ลดพิเศษสำหรับ Buying Bulk', desc: 'ซื้อ 500kg ขึ้นไป ลด 3฿/credit', discount: 3 },
  { id: 'c2', title: 'ใบรับรองฟรี', desc: 'ซื้อ 1000kg รับใบรับรอง PDF ฟรี', freeCert: true },
];

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Head>
        <title>KleanLoop - หน้าแรก</title>
        <meta name="description" content="แพลตฟอร์มขายพลาสติกรีไซเคิลที่ยั่งยืน" />
      </Head>

      <Layout userType={user.type} userName={user.name}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">โปรโมชั่นสำหรับคุณ</h1>

          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <motion.div className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="mb-2 text-xl font-bold">โปรโมชั่นการขาย</h2>
              <p className="mb-4 text-sm text-gray-600">เพิ่มรายได้จากการขายพลาสติกของคุณ</p>
              <div className="space-y-3">
                {SELL_PROMOS.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{p.title}</p>
                        <p className="text-sm text-gray-500">{p.desc}</p>
                      </div>
                      <div className="text-right">
                        {p.bonus && <p className="text-accent font-bold">+{p.bonus}฿/kg</p>}
                        {p.bonusPercent && <p className="text-accent font-bold">+{p.bonusPercent}%</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="mb-2 text-xl font-bold">โปรโมชั่นการซื้อ Credits</h2>
              <p className="mb-4 text-sm text-gray-600">ข้อเสนอพิเศษสำหรับบริษัทที่ต้องการจัดการคาร์บอน</p>
              <div className="space-y-3">
                {CREDIT_PROMOS.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{c.title}</p>
                        <p className="text-sm text-gray-500">{c.desc}</p>
                      </div>
                      <div className="text-right">
                        {c.discount && <p className="text-success font-bold">-{c.discount}฿/credit</p>}
                        {c.freeCert && <p className="text-success font-bold">ใบรับรองฟรี</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Link href="/buy" className="rounded-2xl bg-accent px-4 py-2 font-semibold text-white">
                  ไปที่หน้าซื้อ Credits
                </Link>
                <Link href="/sell" className="rounded-2xl border border-gray-200 px-4 py-2 font-semibold text-gray-700">
                  ขายพลาสติกของคุณ
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-soft">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-4xl bg-gradient-to-br from-accent to-success shadow-float">
              <span className="text-5xl">♻️</span>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-800">ทำให้พลาสติกของคุณมีมูลค่า</h2>
            <p className="mb-4 text-center text-gray-600">อัปโหลดรูป รับราคาทันที หรือซื้อ Plastic Credits เพื่อชดเชย</p>

            <div className="mt-4 flex gap-2">
              <Link href="/sell" className="rounded-2xl bg-accent px-4 py-2 font-semibold text-white">
                ขายพลาสติก
              </Link>
              <Link href="/buy" className="rounded-2xl border border-gray-200 px-4 py-2 font-semibold text-gray-700">
                ซื้อ Credits
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

