'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menus: { name: string; image_url: string | null };
};

type Order = {
  id: string;
  table_id: number;
  total_price: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  created_at: string;
  order_items: OrderItem[];
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  console.log(orders);

  useEffect(() => {
    const eventSource = new EventSource('/api/admin/orders/stream');

    eventSource.onmessage = (event) => {
      const updatedOrders: Order[] = JSON.parse(event.data);
      setOrders(updatedOrders);
    };

    eventSource.onerror = () => {
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
    <div className='p-4 space-y-4'>
      <h1 className='text-3xl font-bold mb-4'>실시간 주문 관리</h1>
      {orders.map((order) => (
        <Card key={order.id} className='bg-white shadow-lg'>
          <CardContent className='p-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold'>Table {order.table_id}</h2>
              <Badge
                variant={
                  order.status === 'pending'
                    ? 'destructive'
                    : order.status === 'preparing'
                    ? 'default'
                    : order.status === 'ready'
                    ? 'outline'
                    : 'secondary'
                }
                className='text-lg px-3 py-1'
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className='space-y-2'>
              {order.order_items.map((item) => (
                <div key={item.id} className='flex items-center space-x-3'>
                  {item.menus.image_url ? (
                    <img
                      src={item.menus.image_url}
                      alt={item.menus.name}
                      className='w-12 h-12 rounded'
                    />
                  ) : (
                    <div className='w-12 h-12 bg-gray-300 rounded' />
                  )}
                  <span className='text-xl'>
                    {item.menus.name} x {item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className='mt-4 text-lg text-gray-600'>
              주문 시간: {new Date(order.created_at).toLocaleTimeString()}
            </div>
            <div className='mt-4 flex space-x-2'>
              <Button
                onClick={() => updateOrderStatus(order.id, 'preparing')}
                disabled={order.status !== 'pending'}
                className='text-lg'
              >
                조리 시작
              </Button>
              <Button
                onClick={() => updateOrderStatus(order.id, 'ready')}
                disabled={order.status !== 'preparing'}
                className='text-lg'
              >
                조리 완료
              </Button>
              <Button
                onClick={() => updateOrderStatus(order.id, 'served')}
                disabled={order.status !== 'ready'}
                className='text-lg'
              >
                서빙 완료
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
