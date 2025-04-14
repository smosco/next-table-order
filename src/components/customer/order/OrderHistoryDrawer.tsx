'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, ClipboardList } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormatters } from '@/hooks/useFormatters';

interface OrderOption {
  name: string;
  price: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  basePrice: number;
  options: OrderOption[];
  totalPrice: number;
}

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  items: OrderItem[];
}

export function OrderHistoryDrawer({
  isOpen,
  setIsOpen,
  tableId,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tableId: string | null;
}) {
  const t = useTranslations('OrderHistoryDrawer');
  const { formatPriceLabel, formatDateTime } = useFormatters();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/public/orders?tableId=${tableId}`)
        .then((res) => res.json())
        .then((data) => setOrders(data.orders))
        .catch((err) => console.error(err));
    }
  }, [isOpen, tableId]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side='right'
        className='w-full sm:max-w-[540px] p-0 flex flex-col bg-white'
      >
        <SheetHeader className='p-8 bg-white border-b border-toss-gray-200'>
          <SheetTitle className='text-3xl font-bold text-toss-gray-900'>
            {t('title')}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className='flex-grow'>
          <AnimatePresence>
            {orders.length > 0 ? (
              <motion.ul layout className='pt-8 pb-12'>
                {orders.map((order) => (
                  <motion.li
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='bg-toss-gray-50 p-6 shadow-sm border-b border-toss-gray-200'
                  >
                    <div className='flex justify-between items-center mb-5'>
                      <div className='flex items-center text-base text-toss-gray-600'>
                        <span className='text-lg before:text-toss-gray-600'>
                          {formatDateTime(order.created_at)}
                        </span>
                      </div>
                      <span className='font-bold text-2xl text-toss-blue-dark'>
                        {formatPriceLabel(order.total_price)}
                      </span>
                    </div>

                    <ul className='space-y-4'>
                      {order.items.map((item: OrderItem, index: number) => (
                        <li
                          key={index}
                          className='flex justify-between items-start bg-white p-4 rounded-lg'
                        >
                          <div className='flex-1 text-xl'>
                            <div className='flex items-center'>
                              <span className='font-medium text-toss-gray-900'>
                                {item.name}
                              </span>
                              <ChevronRight
                                size={20}
                                className='text-toss-gray-400 mx-2'
                              />
                              <span className='text-toss-gray-600'>
                                {item.quantity}
                              </span>
                            </div>
                            {item.options.length > 0 && (
                              <ul className='mt-3 text-toss-gray-500'>
                                {item.options.map((opt, i) => (
                                  <li
                                    key={i}
                                    className='flex items-center mt-2'
                                  >
                                    <span className='w-2 h-2 bg-toss-gray-300 rounded-full mr-2'></span>
                                    {opt.name}
                                    {opt.price > 0 && (
                                      <span className='ml-1 text-toss-gray-700'>
                                        ( +{formatPriceLabel(opt.price)} )
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <span className='font-medium text-xl text-toss-gray-900 ml-2'>
                            {formatPriceLabel(item.totalPrice)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='flex flex-col items-center justify-center h-full text-center text-toss-gray-600 p-8'
              >
                <ClipboardList className='w-24 h-24 mb-6 text-toss-gray-300' />
                <p className='text-xl font-medium'>{t('emptyTitle')}</p>
                <p className='mt-3 text-base'>{t('emptyDescription')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
