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
                  {items.map((item) => {
                    // 옵션 가격 포함된 개별 아이템 총 가격 계산
                    const optionsTotal =
                      item.options?.reduce((sum, opt) => sum + opt.price, 0) ??
                      0;
                    const itemTotalPrice =
                      (item.price + optionsTotal) * item.quantity;

                    return (
                      <div
                        key={`${item.menuId}-${item.options
                          ?.map((opt) => opt.optionId)
                          .join('-')}`} // 옵션이 다르면 별도 항목으로 관리
                        className='flex flex-col gap-3 border-b pb-6'
                      >
                        {/* 메뉴 이름 및 기본 가격 */}
                        <div className='flex justify-between items-start'>
                          <div>
                            <h3 className='font-medium text-lg'>{item.name}</h3>
                            <p className='text-base text-muted-foreground'>
                              {itemTotalPrice.toLocaleString()} ₩
                            </p>

                            {/* 선택한 옵션 표시 */}
                            {item.options && item.options.length > 0 && (
                              <div className='mt-1 text-sm text-gray-500'>
                                {item.options.map((opt) => (
                                  <p
                                    key={opt.optionId}
                                    className='flex justify-between'
                                  >
                                    <span>- {opt.optionName}</span>
                                    {opt.price > 0 && (
                                      <span className='ml-2 text-gray-700'>
                                        (+{opt.price.toLocaleString()}₩)
                                      </span>
                                    )}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 수량 조절 및 삭제 버튼 */}
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
                      </div>
                    );
                  })}
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
