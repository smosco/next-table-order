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
  Grid2X2Plus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('AdminSidebar');

  const sidebarNavItems = [
    { title: t('orders'), href: '/admin', icon: ClipboardList },
    { title: t('dashboard'), href: '/admin/report', icon: Home },
    { title: t('payments'), href: '/admin/payments', icon: CreditCard },
    {
      title: t('analytics'),
      href: '/admin/analytics',
      icon: ChartColumnIncreasing,
    },
    { title: t('menus'), href: '/admin/menus', icon: UtensilsCrossed },
    { title: t('tables'), href: '/admin/tables', icon: Grid2X2Plus },
  ];

  return (
    <div className='hidden lg:flex flex-col h-screen bg-white border-r border-toss-gray-200'>
      <div className='flex h-16 items-center px-6 border-b border-toss-gray-200'>
        <Link
          className='flex items-center gap-2 font-semibold text-toss-gray-900'
          href='/admin'
        >
          <span>{t('brand')}</span>
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
