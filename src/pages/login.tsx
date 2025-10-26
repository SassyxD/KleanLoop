import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { api } from '~/utils/api';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      // Save user ID in cookie
      document.cookie = `userId=${data.user.id}; path=/; max-age=86400`; // 24 hours
      document.cookie = `userType=${data.user.type}; path=/; max-age=86400`;
      
      toast.success(`ยินดีต้อนรับ, ${data.user.name}!`);
      
      // Redirect to home
      setTimeout(() => {
        router.push('/');
      }, 500);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    loginMutation.mutate({ email, password });
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setIsLoading(true);
    loginMutation.mutate({ email: userEmail, password: userPassword });
  };

  return (
    <>
      <Head>
        <title>เข้าสู่ระบบ - KleanLoop</title>
        <meta name="description" content="เข้าสู่ระบบ KleanLoop" />
      </Head>

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 via-secondary-50 to-accent-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-accent to-success shadow-float">
                <span className="text-4xl">♻️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-success">KleanLoop</h1>
                <p className="text-sm text-gray-600">ขายพลาสติกรีไซเคิล</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="rounded-4xl bg-white p-8 shadow-float">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">เข้าสู่ระบบ</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 py-3 pl-11 pr-4 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 py-3 pl-11 pr-4 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-success py-3 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>เข้าสู่ระบบ</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm text-gray-500">หรือ</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Quick Login Buttons */}
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-gray-600">
                ทดลองเข้าใช้ด้วยบัญชีตัวอย่าง
              </p>
              
              <button
                onClick={() => quickLogin('user@kleanloop.com', 'user123')}
                disabled={isLoading}
                className="w-full rounded-2xl border-2 border-accent/30 bg-accent/5 py-2.5 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent/10 disabled:opacity-50"
              >
                👤 บัญชีส่วนบุคคล (Personal)
              </button>

              <button
                onClick={() => quickLogin('corp@company.com', 'corp123')}
                disabled={isLoading}
                className="w-full rounded-2xl border-2 border-success/30 bg-success/5 py-2.5 text-sm font-medium text-success transition-all hover:border-success hover:bg-success/10 disabled:opacity-50"
              >
                🏢 บัญชีองค์กร (Corporate)
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            PIM Inter Hackathon 2025 - Theme: Sustainability
          </p>
        </motion.div>
      </div>
    </>
  );
}
