'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface Table {
  id: number;
  name: string;
}

interface Order {
  table_id: number;
  total_price: number;
  order_group_id: string;
  items: { name: string; quantity: number; price: number }[];
}

const tables: Table[] = [
  { id: 1, name: 'Table 1' },
  { id: 2, name: 'Table 2' },
  { id: 3, name: 'Table 3' },
  { id: 4, name: 'Table 4' },
  { id: 5, name: 'Table 5' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders/active');
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderByTableId = (tableId: number) =>
    orders.find((order) => order.table_id === tableId) || null;

  const closeTable = async (tableId: number) => {
    try {
      const res = await fetch('/api/admin/orders/close', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId }),
      });

      if (!res.ok) throw new Error('Failed to close table');

      toast({
        title: 'Success',
        description: `Table ${tableId} closed successfully`,
      });

      fetchOrders();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to close table',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='p-6 bg-toss-gray-50 min-h-screen'>
      <h1 className='text-3xl font-bold mb-6 text-toss-gray-900'>
        Admin Orders
      </h1>
      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='w-8 h-8 text-toss-blue animate-spin' />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'
        >
          <AnimatePresence>
            {tables.map((table) => {
              const order = getOrderByTableId(table.id);

              return (
                <motion.div key={table.id} layout>
                  <Card className='overflow-hidden'>
                    <CardContent className='p-6'>
                      <h2 className='text-xl font-bold mb-4 text-toss-gray-900'>
                        {table.name}
                      </h2>
                      {order ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className='mb-4 font-semibold text-toss-blue text-lg'>
                            ${order.total_price.toFixed(2)}
                          </p>
                          <Button
                            className='w-full mb-2 bg-toss-blue hover:bg-toss-blue-dark text-white'
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsSheetOpen(true);
                            }}
                          >
                            View Order
                          </Button>
                          <Button
                            className='w-full bg-toss-red-500 hover:bg-toss-red-600 text-white'
                            onClick={() => closeTable(table.id)}
                          >
                            Close Table
                          </Button>
                        </motion.div>
                      ) : (
                        <p className='text-toss-gray-500'>No active orders</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side='right' className='w-full sm:max-w-lg'>
          <SheetHeader>
            <SheetTitle className='text-2xl font-bold text-toss-gray-900'>
              Order Details
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className='h-[calc(100vh-120px)] mt-6'>
            {selectedOrder && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className='text-xl font-bold mb-2 text-toss-gray-900'>
                  {tables.find((t) => t.id === selectedOrder.table_id)?.name}
                </h2>
                <p className='mb-6 font-bold text-toss-blue text-2xl'>
                  ${selectedOrder.total_price.toFixed(2)}
                </p>
                {selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, index) => (
                    <motion.div
                      key={index}
                      className='flex justify-between py-3 border-b border-toss-gray-200 last:border-b-0'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <span className='text-toss-gray-700'>
                        {item.name} x {item.quantity}
                      </span>
                      <span className='font-medium text-toss-gray-900'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className='text-toss-gray-500'>No items found</p>
                )}
              </motion.div>
            )}
          </ScrollArea>
          <SheetClose asChild>
            <Button className='mt-6 w-full bg-toss-gray-200 text-toss-gray-700 hover:bg-toss-gray-300'>
              Close
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  );
}
