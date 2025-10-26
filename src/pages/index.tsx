import { Layout } from '~/components/Layout';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>KleanLoop - ขายพลาสติกรีไซเคิล</title>
        <meta name="description" content="แพลตฟอร์มขายพลาสติกรีไซเคิลที่ยั่งยืน" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout userType="personal" userName="Guest">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-4xl bg-gradient-to-br from-accent to-success shadow-float">
              <span className="text-6xl">♻️</span>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold text-success md:text-6xl">
              KleanLoop
            </h1>
            
            <p className="mb-8 text-center text-xl text-gray-600 md:text-2xl">
              แพลตฟอร์มขายพลาสติกรีไซเคิลที่ยั่งยืน
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <div className="mb-3 text-4xl">🌿</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  ขายพลาสติก
                </h3>
                <p className="text-sm text-gray-600">
                  อัปโหลดรูป รับราคาทันที
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <div className="mb-3 text-4xl">🏆</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  สะสมคะแนน
                </h3>
                <p className="text-sm text-gray-600">
                  ยิ่งขายมาก ได้มากขึ้น
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <div className="mb-3 text-4xl">💚</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  ช่วยโลก
                </h3>
                <p className="text-sm text-gray-600">
                  ร่วมสร้างความยั่งยืน
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">
                🚀 กำลังพัฒนาระบบ...
              </p>
              <p className="mt-2 text-xs text-gray-400">
                PIM Inter Hackathon 2025 - Theme: Sustainability
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
