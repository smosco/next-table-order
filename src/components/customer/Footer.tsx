'use client';

import { useState } from 'react';
import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import { ShoppingCart, History } from 'lucide-react';
import { OrderHistoryDrawer } from './order/OrderHistoryDrawer';

export function BottomBar() {
  const { total, setIsCartOpen } = useCart();
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  return (
    <>
      <div className='sticky bottom-0 border-t bg-background p-4 shadow-md'>
        <div className='flex justify-end max-w-7xl mx-auto space-x-2'>
          <Button
            className='text-lg py-6 px-8'
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className='mr-3 w-6 h-6' />
            {total > 0 ? `Order Now ${total.toLocaleString()} ₩` : 'View Cart'}
          </Button>
          <Button
            className='text-lg py-6 px-8'
            onClick={() => setIsOrderHistoryOpen(true)}
          >
            <History className='mr-3 w-6 h-6' />
            Order History
          </Button>
        </div>
      </div>

      {/* 상태를 prop으로 전달 */}
      {isOrderHistoryOpen && (
        <OrderHistoryDrawer
          isOpen={isOrderHistoryOpen}
          setIsOpen={setIsOrderHistoryOpen}
          tableId={1}
        />
      )}
    </>
  );
}
