'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormatters } from '@/hooks/useFormatters';

type OrderOption = {
  name: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menus: { name: string; image_url: string | null };
  order_item_options: {
    options_id: string;
    options_price: string;
    options: OrderOption;
  }[];
};

type Order = {
  id: string;
  table_id: number;
  total_price: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  created_at: string;
  order_items: OrderItem[];
};

const statusColors = {
  pending: 'bg-toss-red-500 text-white',
  preparing: 'bg-toss-blue text-white',
  ready: 'bg-toss-green-500 text-white',
  served: 'bg-toss-gray-500 text-white',
};

export default function Orders() {
  const t = useTranslations('AdminOrdersPage');
  const { formatDateTime } = useFormatters();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const response = await fetch('/api/admin/orders');
    const data = await response.json();
    setOrders(data);
    setIsLoading(false);
  }, []);

  const fetchUpdatedOrder = async (orderId: string) => {
    const response = await fetch(`/api/admin/orders/${orderId}`);
    const updatedOrder = await response.json();

    setOrders((prevOrders) => {
      const existingIndex = prevOrders.findIndex(
        (order) => order.id === updatedOrder.id
      );

      if (existingIndex !== -1) {
        return prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      } else {
        return [updatedOrder, ...prevOrders];
      }
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const eventSource = new EventSource('/api/admin/orders/stream');

    eventSource.onmessage = async (event) => {
      const [eventType, orderId] = event.data.split(':');

      if (eventType === 'order_paid' || eventType === 'order_status_updated') {
        fetchUpdatedOrder(orderId);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const updateOrderStatus = async (
    orderId: string,
    newStatus: 'preparing' | 'ready' | 'served'
  ) => {
    await fetch('/api/admin/orders/update-status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen'
    >
      <h1 className='text-3xl font-bold mb-6'>{t('title')}</h1>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='w-8 h-8 text-blue-500 animate-spin' />
        </div>
      ) : (
        <AnimatePresence>
          {orders
            .filter((order) => order.status !== 'served')
            .map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className='bg-white shadow-md mb-6 overflow-hidden'>
                  <CardContent className='p-6'>
                    <div className='flex justify-between items-center mb-4'>
                      <h2 className='text-2xl font-bold'>
                        {t('table', { number: order.table_id })}
                      </h2>
                      <Badge
                        className={`text-sm px-3 py-1 rounded-full ${
                          statusColors[order.status]
                        }`}
                      >
                        {t(`status.${order.status}`)}
                      </Badge>
                    </div>
                    <div className='space-y-4'>
                      {order.order_items.map((item) => (
                        <motion.div
                          key={item.id}
                          className='flex flex-col space-y-2 bg-gray-50 p-3 rounded-lg'
                        >
                          <div className='flex items-center space-x-4'>
                            {item.menus.image_url ? (
                              <img
                                src={item.menus.image_url}
                                alt={item.menus.name}
                                className='w-16 h-16 rounded-lg object-cover'
                              />
                            ) : (
                              <div className='w-16 h-16 bg-gray-200 rounded-lg' />
                            )}
                            <div>
                              <span className='text-lg font-medium'>
                                {item.menus.name} x {item.quantity}
                              </span>
                            </div>
                          </div>
                          {item.order_item_options.length > 0 && (
                            <ul className='mt-1 text-sm text-toss-gray-700'>
                              {item.order_item_options.map((opt, i) => (
                                <li key={i} className='flex justify-between'>
                                  <span>- {opt.options.name}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <div className='mt-4 text-sm text-gray-600'>
                      {t('timeLabel', {
                        time: formatDateTime(order.created_at),
                      })}
                    </div>
                    <div className='mt-4 flex space-x-2'>
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        disabled={order.status !== 'pending'}
                        className='bg-toss-blue text-white hover:bg-toss-blue-dark transition-colors'
                      >
                        {t('buttons.startCooking')}
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        disabled={order.status !== 'preparing'}
                        className='bg-toss-green-500 text-white hover:bg-toss-green-600 transition-colors'
                      >
                        {t('buttons.readyToServe')}
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'served')}
                        disabled={order.status !== 'ready'}
                        className='bg-toss-gray-500 text-white hover:bg-toss-gray-600 transition-colors'
                      >
                        {t('buttons.served')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
