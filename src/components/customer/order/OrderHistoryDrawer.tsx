'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  items: OrderItem[]; // ✅ 올바른 타입 명시
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
      <SheetContent side='right'>
        <SheetHeader>
          <SheetTitle>Order History</SheetTitle>
        </SheetHeader>
        <div className='p-4'>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <li key={order.id} className='border-b py-4'>
                  <span className='block text-sm text-gray-500'>
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                  <span className='font-bold'>{order.total_price}원</span>
                  <ul className='mt-2 text-sm text-gray-700'>
                    {order.items.map((item: OrderItem, index: number) => (
                      <li key={index} className='flex justify-between'>
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>{item.price * item.quantity}원</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>No order history</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
