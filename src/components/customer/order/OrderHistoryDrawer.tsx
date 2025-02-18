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

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
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
        className='w-full sm:max-w-[540px] p-6 bg-toss-gray-100'
      >
        <SheetHeader>
          <SheetTitle className='text-2xl font-semibold text-toss-gray-900'>
            Order History
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className='h-[calc(100vh-120px)] mt-6'>
          <AnimatePresence>
            {orders.length > 0 ? (
              <motion.ul layout className='space-y-4'>
                {orders.map((order) => (
                  <motion.li
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='bg-white rounded-2xl p-4 shadow-sm'
                  >
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-sm text-toss-gray-600'>
                        {new Date(order.created_at).toLocaleString()}
                      </span>
                      <span className='font-bold text-lg text-toss-blue'>
                        {order.total_price.toLocaleString()}₩
                      </span>
                    </div>
                    <ul className='mt-3 space-y-2'>
                      {order.items.map((item: OrderItem, index: number) => (
                        <li
                          key={index}
                          className='flex justify-between text-sm'
                        >
                          <span className='text-toss-gray-700'>
                            {item.name} x {item.quantity}
                          </span>
                          <span className='text-toss-gray-900 font-medium'>
                            {(item.price * item.quantity).toLocaleString()}₩
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='text-center text-toss-gray-600 text-lg py-8'
              >
                No order history
              </motion.p>
            )}
          </AnimatePresence>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
