import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';

interface NavItem {
  label: string;
  href: string;
  personalOnly?: boolean;
  corporateOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'หน้าหลัก', href: '/' },
  { label: 'ขาย', href: '/sell', personalOnly: true },
  { label: 'ซื้อ', href: '/buy', corporateOnly: true },
  { label: 'แจ้งเตือน', href: '/notifications' },
  { label: 'โปรไฟล์', href: '/profile' },
];

interface DesktopNavProps {
  userType?: 'personal' | 'corporate';
  userName?: string;
}

export function DesktopNav({ userType = 'personal', userName }: DesktopNavProps) {
  const router = useRouter();

  const filteredItems = navItems.filter((item) => {
    if (item.personalOnly && userType !== 'personal') return false;
    if (item.corporateOnly && userType !== 'corporate') return false;
    return true;
  });

  return (
    <nav className="hidden border-b border-gray-200 bg-white shadow-sm md:block">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-success">
                <span className="text-2xl">♻️</span>
              </div>
              <span className="text-2xl font-bold text-success">KleanLoop</span>
            </div>
          </Link>

          <div className="flex items-center gap-8">
            {filteredItems.map((item) => {
              const isActive = router.pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <div className="relative py-2">
                    <span
                      className={cn(
                        'text-base font-medium transition-colors',
                        isActive ? 'text-accent' : 'text-gray-600 hover:text-accent'
                      )}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeDesktopNav"
                        className="absolute -bottom-4 left-0 right-0 h-0.5 bg-accent"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {userName && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <span className="text-lg font-semibold text-accent">
                  {userName.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">{userName}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
