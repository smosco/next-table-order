'use client';

import { useState, useEffect } from 'react';
import { CartProvider } from '@/app/CartProvider';
import { CategorySidebar } from '@/components/customer/menu/CategorySidebar';
import { TableInfo } from '@/components/customer/TableInfo';
import { CartDrawer } from '@/components/customer/order/CartDrawer';
import { BottomBar } from '@/components/customer/Footer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tableNumber, setTableNumber] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const savedTableNumber = localStorage.getItem('tableNumber');
    if (savedTableNumber) {
      setTableNumber(savedTableNumber);
    } else {
      setIsDialogOpen(true);
    }
  }, []);

  const handleSetTableNumber = () => {
    if (tableNumber.trim()) {
      localStorage.setItem('tableNumber', tableNumber);
      setIsDialogOpen(false);
    }
  };

  return (
    <CartProvider>
      <div className='flex h-screen bg-background'>
        <CategorySidebar />
        <main className='flex-1 flex flex-col'>
          <TableInfo tableNumber={tableNumber} />
          <div className='flex-1 overflow-auto'>{children}</div>
          <BottomBar />
        </main>
        <CartDrawer />
      </div>

      {/* Table number input modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Table Number</DialogTitle>
          </DialogHeader>
          <Input
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder='Enter your table number'
          />
          <Button onClick={handleSetTableNumber} className='w-full'>
            Confirm
          </Button>
        </DialogContent>
      </Dialog>
    </CartProvider>
  );
}
