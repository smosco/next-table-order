'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Home,
  ClipboardList,
  CreditCard,
  CodeIcon as ChartColumnIncreasing,
  UtensilsCrossed,
  Settings,
} from 'lucide-react';
import { motion } from 'framer-motion';

const sidebarNavItems = [
  { title: 'Dashboard', href: '/admin', icon: Home },
  { title: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { title: 'Payment', href: '/admin/payment', icon: CreditCard },
  { title: 'Analytics', href: '/admin/analytics', icon: ChartColumnIncreasing },
  { title: 'Menu', href: '/admin/menu', icon: UtensilsCrossed },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='hidden lg:flex flex-col h-screen bg-white border-r border-toss-gray-200'>
      <div className='flex h-16 items-center px-6 border-b border-toss-gray-200'>
        <Link
          className='flex items-center gap-2 font-semibold text-toss-gray-900'
          href='/admin'
        >
          <span>Restaurant POS</span>
        </Link>
      </div>
      <ScrollArea className='flex-1 py-6'>
        <nav className='px-4 space-y-1'>
          {sidebarNavItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* TODO(@smosco): link 이동일 때 로그인 여부 제대로 판단 못함 (url 쳐서 이동은 잘됨) */}
              <Link href={item.href}>
                <span
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-toss-blue-light text-toss-blue'
                      : 'text-toss-gray-700 hover:bg-toss-gray-100 hover:text-toss-gray-900'
                  )}
                >
                  <item.icon className='mr-3 h-5 w-5' />
                  <span>{item.title}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
