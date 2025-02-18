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

type PopularMenuItem = {
  menuId: string;
  menuName: string;
  quantitySold: number;
  totalRevenue: number;
};

export function PopularItems({ range }: { range: string }) {
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
            Popular Items ({range})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-toss-gray-700'>Menu Item</TableHead>
                <TableHead className='text-toss-gray-700'>
                  Sold Quantity
                </TableHead>
                <TableHead className='text-toss-gray-700'>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <motion.tr
                  key={item.menuId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TableCell className='font-medium text-toss-gray-900'>
                    {item.menuName}
                  </TableCell>
                  <TableCell className='text-toss-gray-700'>
                    {item.quantitySold} sold
                  </TableCell>
                  <TableCell className='text-toss-gray-700'>
                    {item.totalRevenue.toLocaleString()} ₩
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
