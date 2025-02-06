import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SalesSummary = {
  totalRevenue: number;
  averageDailyRevenue: number;
  totalItemsSold: number;
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

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Revenue ({range}):
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {summary?.totalRevenue.toLocaleString()} ₩
          </div>
          {/* <p className='text-xs text-muted-foreground'>
              +20.1% compared to last month
            </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Average Daily Revenue ({range}):
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {summary?.averageDailyRevenue.toLocaleString()} ₩
          </div>
          {/* <p className='text-xs text-muted-foreground'>
              +2.5% compared to last month
            </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Items Sold ({range}):
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{summary?.totalItemsSold}</div>
          {/* <p className='text-xs text-muted-foreground'>
              +12% compared to last month
            </p> */}
        </CardContent>
      </Card>
    </div>
  );
}
