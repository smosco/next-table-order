'use client';

import { useState } from 'react';
import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { OrderButton } from './OrderButton';
import { PaymentModal } from './PaymentModal';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    total,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleOrderSuccess = (orderId: string) => {
    setOrderId(orderId);
    setIsPaymentOpen(true);
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side='right' className='w-full sm:max-w-[540px] p-6'>
          <div className='flex flex-col h-full'>
            <h2 className='font-semibold text-2xl mb-6'>Your Cart</h2>

            <ScrollArea className='flex-1 -mx-6 px-6'>
              {items.length === 0 ? (
                <p className='text-center text-muted-foreground text-lg'>
                  Your cart is empty
                </p>
              ) : (
                <div className='space-y-6'>
                  {items.map((item) => (
                    <div
                      key={item.menuId}
                      className='flex items-center justify-between gap-4 border-b pb-6'
                    >
                      <div className='flex-1'>
                        <h3 className='font-medium text-lg'>{item.name}</h3>
                        <p className='text-base text-muted-foreground'>
                          {item.price.toLocaleString()} ₩
                        </p>
                      </div>

                      <div className='flex items-center gap-3'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-12 w-12'
                          onClick={() =>
                            updateQuantity(
                              item.menuId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          {/* TODO(@smosco): icon size */}
                          <Minus />
                        </Button>
                        <span className='w-8 text-center text-lg'>
                          {item.quantity}
                        </span>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-12 w-12'
                          onClick={() =>
                            updateQuantity(item.menuId, item.quantity + 1)
                          }
                        >
                          <Plus />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-12 w-12'
                          onClick={() => removeItem(item.menuId)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className='border-t pt-6 mt-6'>
              <div className='flex justify-between mb-6'>
                <span className='font-semibold text-xl'>Total Price</span>
                <span className='font-semibold text-xl'>
                  {total.toLocaleString()} ₩
                </span>
              </div>
              <OrderButton
                tableId={1}
                cartItems={items}
                onOrderSuccess={handleOrderSuccess}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {orderId && (
        <PaymentModal
          orderId={orderId}
          totalPrice={total}
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}
    </>
  );
}
