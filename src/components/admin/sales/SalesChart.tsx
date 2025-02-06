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
    <div className='p-4 bg-white rounded shadow'>
      <h2 className='text-lg font-semibold mb-2'>Sales Trend ({range})</h2>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='totalRevenue'
            stroke='#8884d8'
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
