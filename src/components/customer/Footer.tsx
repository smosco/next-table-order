'use client';

import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function BottomBar() {
  const { total, setIsCartOpen } = useCart();

  return (
    <div className='sticky bottom-0 border-t bg-background p-4 shadow-md'>
      <div className='flex justify-end max-w-7xl mx-auto'>
        <Button
          className='text-lg py-6 px-8'
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className='mr-3 w-6 h-6' />
          {total > 0 ? `Order Now ${total.toLocaleString()} ₩` : 'View Cart'}
        </Button>
      </div>
    </div>
  );
}
