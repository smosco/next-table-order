'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { OrderButton } from './OrderButton';
import { PaymentModal } from './PaymentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useFormatters } from '@/hooks/useFormatters';

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
  const [tableId, setTableId] = useState<string | null>(null);

  const t = useTranslations('CartDrawer');
  const { formatPriceLabel } = useFormatters();

  useEffect(() => {
    // 로컬스토리지에서 테이블 ID 가져오기
    const storedTableId = localStorage.getItem('tableId');
    if (storedTableId) {
      setTableId(storedTableId);
    }
  }, [tableId]);

  const handleOrderSuccess = (orderId: string) => {
    setOrderId(orderId);
    setIsPaymentOpen(true);
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          side='right'
          className='w-full sm:max-w-[540px] p-8 bg-toss-gray-100'
        >
          <div className='flex flex-col h-full'>
            <h2 className='font-semibold text-3xl mb-8 text-toss-gray-900'>
              {t('title')}
            </h2>

            <ScrollArea className='flex-1 -mx-6 px-6'>
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-center text-toss-gray-600 text-xl py-10'
                  >
                    {t('empty')}
                  </motion.p>
                ) : (
                  <motion.div layout className='space-y-8'>
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
                          className='flex flex-col gap-4 bg-white rounded-2xl p-6 shadow-sm'
                        >
                          <div className='flex justify-between items-start'>
                            <div>
                              <h3 className='font-medium text-xl text-toss-gray-900'>
                                {item.name}
                              </h3>
                              <p className='text-xl text-toss-gray-700'>
                                {formatPriceLabel(itemTotalPrice)}
                              </p>
                              {item.options && item.options.length > 0 && (
                                <div className='mt-3 text-lg text-toss-gray-600'>
                                  {item.options.map((opt) => (
                                    <p
                                      key={opt.optionId}
                                      className='flex justify-between'
                                    >
                                      <span>- {opt.optionName}</span>
                                      {opt.price > 0 && (
                                        <span className='ml-2 text-toss-gray-700'>
                                          ( +{formatPriceLabel(opt.price)} )
                                        </span>
                                      )}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className='flex items-center gap-3'>
                              <Button
                                variant='outline'
                                size='icon'
                                className='h-14 w-14 rounded-full bg-toss-gray-200 border-none text-toss-gray-700'
                                onClick={() =>
                                  updateQuantity(
                                    item.menuId,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                              >
                                <Minus
                                  style={{ width: '28px', height: '28px' }}
                                />
                              </Button>

                              <span className='w-10 text-center text-2xl text-toss-gray-900'>
                                {item.quantity}
                              </span>

                              <Button
                                variant='outline'
                                size='icon'
                                className='h-14 w-14 rounded-full bg-toss-gray-200 border-none text-toss-gray-700'
                                onClick={() =>
                                  updateQuantity(item.menuId, item.quantity + 1)
                                }
                              >
                                <Plus
                                  style={{ width: '28px', height: '28px' }}
                                />
                              </Button>

                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-14 w-14 text-toss-gray-500 hover:text-toss-gray-700'
                                onClick={() => removeItem(item.menuId)}
                              >
                                <Trash2
                                  style={{ width: '28px', height: '28px' }}
                                />
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
              className='border-t border-toss-gray-300 pt-8 mt-8'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className='flex justify-between mb-8'>
                <span className='font-semibold text-2xl text-toss-gray-900'>
                  {t('total')}
                </span>
                <span className='font-semibold text-2xl text-toss-blue'>
                  {formatPriceLabel(total)}
                </span>
              </div>

              {/* 테이블 ID가 있을 때만 주문 가능하도록 수정 */}
              {tableId ? (
                <OrderButton
                  tableId={Number.parseInt(tableId, 10)}
                  cartItems={items}
                  onOrderSuccess={handleOrderSuccess}
                />
              ) : (
                <p className='text-center text-red-500 font-medium text-lg'>
                  {t('needTable')}
                </p>
              )}
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
