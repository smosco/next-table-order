'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useFormatters } from '@/hooks/useFormatters';

type PopularMenuItem = {
  menu_id: string;
  menu_name: string;
  total_quantity: number;
  total_revenue: number;
};

export function PopularItems({ range }: { range: string }) {
  const t = useTranslations('PopularItems');
  const rangeLabel = t(`ranges.${range}`);
  const { formatPriceLabel } = useFormatters();

  const [items, setItems] = useState<PopularMenuItem[]>([]);

  useEffect(() => {
    async function fetchPopularItems() {
      const res = await fetch(`/api/admin/sales/top-menus?range=${range}`);
      const json = await res.json();
      setItems(json);
    }
    fetchPopularItems();
  }, [range]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='bg-white border-toss-gray-200'>
        <CardHeader>
          <CardTitle className='text-lg font-semibold text-toss-gray-900'>
            {t('title', { rangeLabel })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-toss-gray-700'>
                  {t('menu')}
                </TableHead>
                <TableHead className='text-toss-gray-700'>
                  {t('quantity')}
                </TableHead>
                <TableHead className='text-toss-gray-700'>
                  {t('revenue')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <motion.tr
                  key={item.menu_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TableCell className='font-medium text-toss-gray-900'>
                    {item.menu_name}
                  </TableCell>
                  <TableCell className='text-toss-gray-700'>
                    {t('sold', { count: item.total_quantity })}
                  </TableCell>
                  <TableCell className='text-toss-gray-700'>
                    {formatPriceLabel(item.total_revenue)}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
