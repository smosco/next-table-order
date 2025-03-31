'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //  전체 주문 목록 가져오는 API (초기 로딩)
  const fetchOrders = useCallback(async () => {
    const response = await fetch('/api/admin/orders');
    const data = await response.json();
    setOrders(data);
    setIsLoading(false);
  }, []);

  //  특정 주문 ID만 가져와 업데이트하는 API
  const fetchUpdatedOrder = async (orderId: string) => {
    const response = await fetch(`/api/admin/orders/${orderId}`);
    const updatedOrder = await response.json();

    setOrders((prevOrders) => {
      const existingIndex = prevOrders.findIndex(
        (order) => order.id === updatedOrder.id
      );

      if (existingIndex !== -1) {
        // 기존 주문이 있으면 업데이트
        return prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      } else {
        // 새로운 주문이면 추가
        return [updatedOrder, ...prevOrders];
      }
    });
  };

  //  초기 데이터 로딩
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  //  SSE를 통한 실시간 업데이트 감지
  useEffect(() => {
    const eventSource = new EventSource('/api/admin/orders/stream');

    eventSource.onmessage = async (event) => {
      console.log('📡 SSE 이벤트 감지:', event.data);

      const [eventType, orderId] = event.data.split(':');

      if (eventType === 'order_paid' || eventType === 'order_status_updated') {
        fetchUpdatedOrder(orderId); // 특정 주문만 다시 가져옴
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  //  주문 상태 업데이트 API 호출
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
      className='p-6 bg-gray-100 min-h-screen'
    >
      <h1 className='text-3xl font-bold mb-6'>Real-time Order Management</h1>
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
                        Table {order.table_id}
                      </h2>
                      <Badge
                        className={`text-sm px-3 py-1 rounded-full ${
                          statusColors[order.status]
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
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

                          {/* 옵션 정보 표시 */}
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
                      Order Time:{' '}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                    <div className='mt-4 flex space-x-2'>
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        disabled={order.status !== 'pending'}
                        className='bg-toss-blue text-white hover:bg-toss-blue-dark transition-colors'
                      >
                        Start Cooking
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        disabled={order.status !== 'preparing'}
                        className='bg-toss-green-500 text-white hover:bg-toss-green-600 transition-colors'
                      >
                        Ready to Serve
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'served')}
                        disabled={order.status !== 'ready'}
                        className='bg-toss-gray-500 text-white hover:bg-toss-gray-600 transition-colors'
                      >
                        Served
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
