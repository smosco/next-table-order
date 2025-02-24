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
  tableId: number;
}) {
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
        <SheetHeader className='p-6 bg-white border-b border-toss-gray-200'>
          <SheetTitle className='text-2xl font-bold text-toss-gray-900'>
            Order History
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className='flex-grow'>
          <AnimatePresence>
            {orders.length > 0 ? (
              <motion.ul layout className='space-y-4 p-6'>
                {orders.map((order) => (
                  <motion.li
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='bg-toss-gray-50 rounded-2xl p-5 shadow-sm border border-toss-gray-200'
                  >
                    <div className='flex justify-between items-center mb-4'>
                      <div className='flex items-center text-sm text-toss-gray-600'>
                        <Clock size={16} className='mr-1' />
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                      <span className='font-bold text-lg text-toss-blue-dark'>
                        {order.total_price.toLocaleString()}₩
                      </span>
                    </div>

                    <ul className='space-y-3'>
                      {order.items.map((item: OrderItem, index: number) => (
                        <li
                          key={index}
                          className='flex justify-between items-start bg-white p-3 rounded-lg'
                        >
                          <div className='flex-1'>
                            <div className='flex items-center'>
                              <span className='font-medium text-toss-gray-900'>
                                {item.name}
                              </span>
                              <ChevronRight
                                size={16}
                                className='text-toss-gray-400 mx-1'
                              />
                              <span className='text-sm text-toss-gray-600'>
                                {item.quantity}
                              </span>
                            </div>
                            {item.options.length > 0 && (
                              <ul className='mt-2 text-xs text-toss-gray-500'>
                                {item.options.map((opt, i) => (
                                  <li
                                    key={i}
                                    className='flex items-center mt-1'
                                  >
                                    <span className='w-1 h-1 bg-toss-gray-300 rounded-full mr-2'></span>
                                    {opt.name}
                                    {opt.price > 0 && (
                                      <span className='ml-1 text-toss-gray-700'>
                                        (+{opt.price.toLocaleString()}₩)
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <span className='font-medium text-toss-gray-900 ml-2'>
                            {item.totalPrice.toLocaleString()}₩
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
                className='flex flex-col items-center justify-center h-full text-center text-toss-gray-600 p-6'
              >
                <ClipboardList className='w-16 h-16 mb-4 text-toss-gray-300' />
                <p className='text-lg font-medium'>No order history</p>
                <p className='mt-2 text-sm'>Make your first order!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
