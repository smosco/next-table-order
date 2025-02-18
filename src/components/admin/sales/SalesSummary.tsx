'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, Variants } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type SalesSummary = {
  totalRevenue: number;
  averageDailyRevenue: number;
  totalItemsSold: number;
  percentageChanges: {
    totalRevenue: number;
    averageDailyRevenue: number;
    totalItemsSold: number;
  };
};

export default function SalesSummary({ range = 'week' }) {
  const [summary, setSummary] = useState<SalesSummary | null>(null);

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
        title='Total Revenue'
        value={summary?.totalRevenue || 0}
        percentage={summary?.percentageChanges?.totalRevenue || 0}
        range={range}
        variants={cardVariants}
      />
      <SummaryCard
        title='Average Daily Revenue'
        value={summary?.averageDailyRevenue || 0}
        percentage={summary?.percentageChanges?.averageDailyRevenue || 0}
        range={range}
        variants={cardVariants}
      />
      <SummaryCard
        title='Total Items Sold'
        value={summary?.totalItemsSold || 0}
        percentage={summary?.percentageChanges?.totalItemsSold || 0}
        range={range}
        variants={cardVariants}
        isCurrency={false}
      />
    </motion.div>
  );
}

function SummaryCard({
  title,
  value,
  percentage,
  range,
  variants,
  isCurrency = true,
}: {
  title: string;
  value: number;
  percentage: number;
  range: string;
  variants: Variants;
  isCurrency?: boolean;
}) {
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
            {isCurrency
              ? `${value.toLocaleString()} ₩`
              : value.toLocaleString()}
          </div>
          <p className='text-xs text-toss-gray-600 mt-1 flex items-center'>
            <span className='mr-1'>
              {percentage > 0 ? (
                <TrendingUp className='w-4 h-4 text-toss-green-500' />
              ) : percentage < 0 ? (
                <TrendingDown className='w-4 h-4 text-toss-red-500' />
              ) : (
                <Minus className='w-4 h-4 text-toss-gray-500' />
              )}
            </span>
            <span
              className={
                percentage > 0
                  ? 'text-toss-green-500'
                  : percentage < 0
                  ? 'text-toss-red-500'
                  : 'text-toss-gray-500'
              }
            >
              {percentage > 0 ? '+' : ''}
              {percentage.toFixed(1)}%
            </span>{' '}
            vs previous {range}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
