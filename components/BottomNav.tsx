'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  icon: string;
  label: string;
  activeIcon: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    icon: '🏠',
    activeIcon: '🏠',
    label: 'Home',
  },
  {
    href: '/accounts',
    icon: '💳',
    activeIcon: '💳',
    label: 'Accounts',
  },
  {
    href: '/goals',
    icon: '🎯',
    activeIcon: '🎯',
    label: 'Goals',
  },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide on onboarding and transaction flows
  if (pathname.startsWith('/onboard') || pathname.startsWith('/deposit') || pathname.startsWith('/withdraw')) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-800 safe-area-pb"
    >
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/accounts' && pathname.startsWith('/accounts'));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-xl transition-colors',
                isActive ? 'text-emerald-500' : 'text-zinc-400'
              )}
            >
              <div className="relative">
                <motion.div
                  className="text-xl leading-none mb-1"
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {isActive ? item.activeIcon : item.icon}
                </motion.div>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-emerald-500 rounded-full"
                    layoutId="activeIndicator"
                    initial={false}
                    style={{ x: '-50%' }}
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium truncate',
                  isActive ? 'text-emerald-500' : 'text-zinc-500'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}