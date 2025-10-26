import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, TrendingUp, Bell, ShoppingCart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  personalOnly?: boolean;
  corporateOnly?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'หน้าหลัก', href: '/' },
  { icon: TrendingUp, label: 'ขาย', href: '/sell', personalOnly: true },
  { icon: ShoppingCart, label: 'ซื้อ', href: '/buy', corporateOnly: true },
  { icon: Bell, label: 'แจ้งเตือน', href: '/notifications' },
  { icon: User, label: 'โปรไฟล์', href: '/profile' },
];

interface MobileNavProps {
  userType?: 'personal' | 'corporate';
}

export function MobileNav({ userType = 'personal' }: MobileNavProps) {
  const router = useRouter();

  const filteredItems = navItems.filter((item) => {
    if (item.personalOnly && userType !== 'personal') return false;
    if (item.corporateOnly && userType !== 'corporate') return false;
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative mx-4 mb-4 rounded-4xl bg-white shadow-float">
        <div className="flex items-center justify-around px-2 py-3">
          {filteredItems.map((item) => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div className="relative flex flex-col items-center gap-1">
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -inset-3 rounded-2xl bg-accent/10"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'relative z-10 h-6 w-6 transition-colors',
                      isActive ? 'text-accent' : 'text-gray-400'
                    )}
                  />
                  <span
                    className={cn(
                      'relative z-10 text-xs font-medium transition-colors',
                      isActive ? 'text-accent' : 'text-gray-400'
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
