'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronRight } from 'lucide-react';

interface Table {
  id: number;
  name: string;
}

interface OrderOption {
  name: string;
  price: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
  options: OrderOption[];
}

interface Order {
  table_id: number;
  total_price: number;
  order_group_id: string;
  items: OrderItem[];
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
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900'>Admin Orders</h1>
      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='w-8 h-8 text-blue-500 animate-spin' />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        >
          <AnimatePresence>
            {tables.map((table) => {
              const order = getOrderByTableId(table.id);

              return (
                <motion.div key={table.id} layout>
                  <Card className='overflow-hidden hover:shadow-md transition-shadow duration-200'>
                    <CardContent className='p-4'>
                      <h2 className='text-lg font-semibold mb-2 text-gray-900'>
                        {table.name}
                      </h2>
                      {order ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className='space-y-2'
                        >
                          <p className='font-medium text-blue-600 text-lg'>
                            ${order.total_price.toFixed(2)}
                          </p>
                          <Button
                            className='w-full justify-between bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsSheetOpen(true);
                            }}
                          >
                            View Order
                            <ChevronRight size={16} />
                          </Button>
                          <Button
                            className='w-full bg-red-500 hover:bg-red-600 text-white'
                            onClick={() => closeTable(table.id)}
                          >
                            Close Table
                          </Button>
                        </motion.div>
                      ) : (
                        <p className='text-gray-500'>No active orders</p>
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
        <SheetContent side='right' className='w-full sm:max-w-md p-0'>
          <SheetHeader className='p-6 border-b border-gray-200'>
            <SheetTitle className='text-2xl font-bold text-gray-900'>
              Order Details
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className='h-[calc(100vh-180px)] px-6'>
            {selectedOrder && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className='py-6'
              >
                <h2 className='text-xl font-bold mb-2 text-gray-900'>
                  {tables.find((t) => t.id === selectedOrder.table_id)?.name}
                </h2>
                <p className='mb-6 font-bold text-blue-600 text-2xl'>
                  ${selectedOrder.total_price.toFixed(2)}
                </p>

                {selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, index) => (
                    <motion.div
                      key={index}
                      className='py-3 border-b border-gray-200 last:border-b-0'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <div className='flex justify-between items-start'>
                        <div>
                          <span className='font-medium text-gray-900'>
                            {item.name}
                          </span>
                          <span className='ml-2 text-sm text-gray-600'>
                            x {item.quantity}
                          </span>
                        </div>
                        <span className='font-medium text-gray-900'>
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>

                      {item.options.length > 0 && (
                        <ul className='mt-1 space-y-1'>
                          {item.options.map((opt, i) => (
                            <li
                              key={i}
                              className='flex justify-between text-sm'
                            >
                              <span className='text-gray-600'>
                                - {opt.name}
                              </span>
                              <span className='text-gray-900'>
                                +${opt.price.toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className='text-gray-500'>No items found</p>
                )}
              </motion.div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
