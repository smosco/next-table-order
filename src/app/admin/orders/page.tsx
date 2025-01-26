'use client';

import { useState, useEffect } from 'react';
import type { Order, OrderItem } from '@/types/schema';
import { orders as initialOrders } from '@/mock/adminMockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    const timer = setInterval(() => {
      const newOrderId = Date.now().toString();

      const newOrderItems: OrderItem[] = [
        {
          id: `oi-${newOrderId}-1`,
          orderId: newOrderId,
          menuItemId: '1',
          quantity: Math.floor(Math.random() * 3) + 1,
          price: 9.99,
        },
      ];

      const totalPrice = newOrderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const newOrder: Order = {
        id: newOrderId,
        tableId: Math.floor(Math.random() * 10) + 1,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    }, 10000); // make new order every 10s

    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = (
    orderId: string,
    newStatus: 'pending' | 'preparing' | 'completed'
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className='p-4 space-y-4'>
      <h1 className='text-3xl font-bold mb-4'>Real-Time Orders</h1>
      {orders.map((order) => (
        <Card key={order.id} className='bg-white shadow-lg'>
          <CardContent className='p-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold'>Table {order.tableId}</h2>
              <Badge
                variant={
                  order.status === 'pending'
                    ? 'destructive'
                    : order.status === 'preparing'
                    ? 'default'
                    : 'secondary'
                }
                className='text-lg px-3 py-1'
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className='space-y-2'>
              <div className='text-xl'>
                Example Item x {Math.floor(Math.random() * 3) + 1}
              </div>
            </div>
            <div className='mt-4 text-lg text-gray-600'>
              Order Time: {new Date(order.createdAt).toLocaleTimeString()}
            </div>
            <div className='mt-4 flex space-x-2'>
              <Button
                onClick={() => handleStatusChange(order.id, 'preparing')}
                disabled={order.status !== 'pending'}
                className='text-lg'
              >
                Start Preparing
              </Button>
              <Button
                onClick={() => handleStatusChange(order.id, 'completed')}
                disabled={order.status === 'completed'}
                className='text-lg'
              >
                Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
