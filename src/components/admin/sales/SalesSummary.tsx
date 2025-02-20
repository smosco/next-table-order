'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, Variants } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type SalesSummary = {
  total_revenue: number;
  average_daily_revenue: number;
  total_items_sold: number;
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
        value={summary?.total_revenue || 0}
        range={range}
        variants={cardVariants}
      />
      <SummaryCard
        title='Average Daily Revenue'
        value={summary?.average_daily_revenue || 0}
        range={range}
        variants={cardVariants}
      />
      <SummaryCard
        title='Total Items Sold'
        value={summary?.total_items_sold || 0}
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
  range,
  variants,
  isCurrency = true,
}: {
  title: string;
  value: number;
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
