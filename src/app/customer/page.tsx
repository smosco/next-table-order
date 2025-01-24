'use client';

import { useState } from 'react';
import { MenuGrid } from '@/components/customer/menu/MenuGrid';
import { CartDrawer } from '@/components/customer/order/CartDrawer';
import { TableInfo } from '@/components/customer/TableInfo';
import { BottomBar } from '@/components/customer/Footer';
import { CategorySidebar } from '@/components/customer/menu/CategorySidebar';

export default function CustomerPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(1);

  return (
    <div className='flex h-screen bg-background'>
      <CategorySidebar onCategorySelect={setActiveCategoryId} />

      <main className='flex-1 flex flex-col'>
        <TableInfo />

        <div className='flex-1 overflow-auto'>
          <MenuGrid activeCategoryId={activeCategoryId} />
        </div>

        <BottomBar />
      </main>

      <CartDrawer />
    </div>
  );
}
