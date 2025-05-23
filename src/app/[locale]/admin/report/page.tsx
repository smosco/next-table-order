'use client';

import { useState } from 'react';
import SalesSummary from '@/components/admin/sales/SalesSummary';
import SalesChart from '@/components/admin/sales/SalesChart';
import { PopularItems } from '@/components/admin/sales/PopularItems';
import { SalesFilter } from '@/components/admin/sales/SalesFilter';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('AdminSalesReportPage');
  const [selectedRange, setSelectedRange] = useState('week');
  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold'>{t('title')}</h1>

      <SalesFilter range={selectedRange} onChange={setSelectedRange} />

      {/* 매출 요약 */}
      <SalesSummary range={selectedRange} />

      {/* 매출 그래프 */}
      <SalesChart range={selectedRange} />

      {/* 인기 메뉴 */}
      <PopularItems range={selectedRange} />
    </div>
  );
}
