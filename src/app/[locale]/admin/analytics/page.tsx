'use client';

import { DataTable } from '@/components/DataTable';
import { columns } from '@/types/columns';
import useOrders from '@/hooks/useOrders';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function OrdersPage() {
  const t = useTranslations('PaymentHistoryPage');
  const { data, isLoading, error } = useOrders();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='container mx-auto py-10 px-4'
    >
      <h1 className='text-3xl font-bold mb-6 text-toss-gray-900'>
        {t('title')}
      </h1>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='w-8 h-8 text-toss-blue animate-spin' />
          <span className='ml-2 text-toss-gray-700'>{t('loading')}</span>
        </div>
      ) : error ? (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-toss-red-500 text-center py-4'
        >
          {t('error')}
        </motion.p>
      ) : (
        <DataTable columns={columns} data={data?.orders || []} />
      )}
    </motion.div>
  );
}
