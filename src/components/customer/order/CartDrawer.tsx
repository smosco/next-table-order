'use client';

import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { PaymentButton } from './PaymentButton';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    total,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side='right' className='w-[400px] sm:max-w-[540px]'>
        <div className='flex flex-col h-full'>
          <h2 className='font-semibold text-lg mb-4'>Your Cart</h2>

          <ScrollArea className='flex-1 -mx-6 px-6'>
            {items.length === 0 ? (
              <p className='text-center text-muted-foreground'>
                Your cart is empty
              </p>
            ) : (
              <div className='space-y-4'>
                {items.map((item) => (
                  <div
                    key={item.menuId}
                    className='flex items-center justify-between gap-4 border-b pb-4'
                  >
                    <div className='flex-1'>
                      <h3 className='font-medium'>{item.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {item.price.toLocaleString()} ₩
                      </p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() =>
                          updateQuantity(
                            item.menuId,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                      <span className='w-8 text-center'>{item.quantity}</span>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() =>
                          updateQuantity(item.menuId, item.quantity + 1)
                        }
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => removeItem(item.menuId)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className='border-t pt-4 mt-4'>
            <div className='flex justify-between mb-4'>
              <span className='font-semibold'>Total Price</span>
              <span className='font-semibold'>{total.toLocaleString()} ₩</span>
            </div>
            <PaymentButton tableId={1} cartItems={items} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
