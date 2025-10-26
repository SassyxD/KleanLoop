import { ReactNode } from 'react';
import { MobileNav } from './MobileNav';
import { DesktopNav } from './DesktopNav';

interface LayoutProps {
  children: ReactNode;
  userType?: 'personal' | 'corporate';
  userName?: string;
}

export function Layout({ children, userType, userName }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <DesktopNav userType={userType} userName={userName} />
      
      <main className="pb-24 md:pb-8">
        {children}
      </main>

      <MobileNav userType={userType} />
    </div>
  );
}
