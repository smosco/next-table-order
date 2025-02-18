'use client';

import { useState } from 'react';
import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { OrderButton } from './OrderButton';
import { PaymentModal } from './PaymentModal';
import { motion, AnimatePresence } from 'framer-motion';

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
        <SheetContent
          side='right'
          className='w-full sm:max-w-[540px] p-6 bg-toss-gray-100'
        >
          <div className='flex flex-col h-full'>
            <h2 className='font-semibold text-2xl mb-6 text-toss-gray-900'>
              Your Cart
            </h2>

            <ScrollArea className='flex-1 -mx-6 px-6'>
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-center text-toss-gray-600 text-lg py-8'
                  >
                    Your cart is empty
                  </motion.p>
                ) : (
                  <motion.div layout className='space-y-6'>
                    {items.map((item) => {
                      const optionsTotal =
                        item.options?.reduce(
                          (sum, opt) => sum + opt.price,
                          0
                        ) ?? 0;
                      const itemTotalPrice =
                        (item.price + optionsTotal) * item.quantity;

                      return (
                        <motion.div
                          key={`${item.menuId}-${item.options
                            ?.map((opt) => opt.optionId)
                            .join('-')}`}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className='flex flex-col gap-3 bg-white rounded-2xl p-4 shadow-sm'
                        >
                          <div className='flex justify-between items-start'>
                            <div>
                              <h3 className='font-medium text-lg text-toss-gray-900'>
                                {item.name}
                              </h3>
                              <p className='text-base text-toss-gray-700'>
                                {itemTotalPrice.toLocaleString()} ₩
                              </p>

                              {item.options && item.options.length > 0 && (
                                <div className='mt-2 text-sm text-toss-gray-600'>
                                  {item.options.map((opt) => (
                                    <p
                                      key={opt.optionId}
                                      className='flex justify-between'
                                    >
                                      <span>- {opt.optionName}</span>
                                      {opt.price > 0 && (
                                        <span className='ml-2 text-toss-gray-700'>
                                          (+{opt.price.toLocaleString()}₩)
                                        </span>
                                      )}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className='flex items-center gap-2'>
                              <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8 rounded-full bg-toss-gray-200 border-none text-toss-gray-700'
                                onClick={() =>
                                  updateQuantity(
                                    item.menuId,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                              >
                                <Minus className='h-4 w-4' />
                              </Button>
                              <span className='w-8 text-center text-lg text-toss-gray-900'>
                                {item.quantity}
                              </span>
                              <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8 rounded-full bg-toss-gray-200 border-none text-toss-gray-700'
                                onClick={() =>
                                  updateQuantity(item.menuId, item.quantity + 1)
                                }
                              >
                                <Plus className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 text-toss-gray-500 hover:text-toss-gray-700'
                                onClick={() => removeItem(item.menuId)}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>

            <motion.div
              layout
              className='border-t border-toss-gray-300 pt-6 mt-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className='flex justify-between mb-6'>
                <span className='font-semibold text-xl text-toss-gray-900'>
                  Total Price
                </span>
                <span className='font-semibold text-xl text-toss-blue'>
                  {total.toLocaleString()} ₩
                </span>
              </div>
              <OrderButton
                tableId={1}
                cartItems={items}
                onOrderSuccess={handleOrderSuccess}
              />
            </motion.div>
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
