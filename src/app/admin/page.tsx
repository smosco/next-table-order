'use client';

import SalesSummary from '@/components/admin/sales/SalesSummary';
import SalesChart from '@/components/admin/sales/SalesChart';
import { PopularItems } from '@/components/admin/sales/PopularItems';

export default function DashboardPage() {
  return (
    <div className='p-8 space-y-8'>
      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <SalesSummary range='week' />
      <SalesChart range='today' />
      <PopularItems range='week' />
    </div>
  );
}
