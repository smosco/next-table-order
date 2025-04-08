'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useFormatters } from '@/hooks/useFormatters';

type SalesSummary = {
  total_revenue: number;
  average_daily_revenue: number;
  total_items_sold: number;
};

export default function SalesSummary({ range = 'week' }: { range: string }) {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const t = useTranslations('SalesSummary');

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/admin/sales/summary?range=${range}`);
      const data = await res.json();
      setSummary(data);
    }
    fetchData();
  }, [range]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'
      initial='hidden'
      animate='visible'
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <SummaryCard
        title={t('totalRevenue')}
        value={summary?.total_revenue || 0}
        variants={cardVariants}
        isCurrency
      />
      <SummaryCard
        title={t('averageDailyRevenue')}
        value={summary?.average_daily_revenue || 0}
        variants={cardVariants}
        isCurrency
      />
      <SummaryCard
        title={t('totalItemsSold')}
        value={summary?.total_items_sold || 0}
        variants={cardVariants}
        isCurrency={false}
      />
    </motion.div>
  );
}

function SummaryCard({
  title,
  value,
  variants,
  isCurrency = true,
}: {
  title: string;
  value: number;
  variants: Variants;
  isCurrency?: boolean;
}) {
  const { formatPriceLabel, formatQuantityLabel } = useFormatters();

  return (
    <motion.div variants={variants}>
      <Card className='bg-white border-toss-gray-200'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-toss-gray-600'>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-toss-gray-900'>
            {isCurrency ? formatPriceLabel(value) : formatQuantityLabel(value)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
