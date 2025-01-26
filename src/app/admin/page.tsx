'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesChart } from '@/components/admin/SalesChart';
import { PopularItems } from '@/components/admin/PopularItems';

export default function DashboardPage() {
  return (
    <div className='p-8 space-y-8'>
      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              This Month's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$45,231</div>
            <p className='text-xs text-muted-foreground'>
              +20.1% compared to last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$320</div>
            <p className='text-xs text-muted-foreground'>
              +2.5% compared to last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Daily Average Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>78</div>
            <p className='text-xs text-muted-foreground'>
              +12% compared to last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Repeat Customer Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24.3%</div>
            <p className='text-xs text-muted-foreground'>
              +5.2% compared to last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Monthly Sales Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Popular Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <PopularItems />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
