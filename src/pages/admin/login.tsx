import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Shield, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin auth (in production, use proper authentication)
    if (username === 'admin' && password === 'admin123') {
      // Set admin session
      document.cookie = `adminAuth=true; path=/; max-age=86400`;
      toast.success('เข้าสู่ระบบสำเร็จ');
      router.push('/admin');
    } else {
      toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - KleanLoop</title>
      </Head>

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600">ระบบจัดการ KleanLoop</p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700/20"
                  placeholder="admin"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700/20"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-700 to-gray-900 py-3 font-semibold text-white transition-all hover:from-gray-800 hover:to-black disabled:opacity-50"
              >
                <LogIn className="h-5 w-5" />
                <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-600">
              <p className="font-semibold">ข้อมูลสำหรับทดสอบ:</p>
              <p className="mt-1">Username: <code className="rounded bg-gray-200 px-2 py-1">admin</code></p>
              <p>Password: <code className="rounded bg-gray-200 px-2 py-1">admin123</code></p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
