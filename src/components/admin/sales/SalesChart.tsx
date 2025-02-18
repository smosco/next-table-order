'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

type DailySales = {
  date: string;
  totalRevenue: number;
};

export default function SalesChart({ range }: { range: string }) {
  const [data, setData] = useState<DailySales[]>([]);

  useEffect(() => {
    async function fetchSales() {
      const res = await fetch(`/api/admin/sales/daily?range=${range}`);
      const json = await res.json();
      setData(json);
    }
    fetchSales();
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
            Sales Trend ({range})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray='3 3' stroke='#E5E8EB' />
              <XAxis dataKey='date' stroke='#6B7684' />
              <YAxis stroke='#6B7684' />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E8EB',
                  borderRadius: '8px',
                }}
              />
              <Line
                type='monotone'
                dataKey='totalRevenue'
                stroke='#3182F6'
                strokeWidth={2}
                dot={{ fill: '#3182F6', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
