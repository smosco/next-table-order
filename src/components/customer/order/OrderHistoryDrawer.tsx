'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';

export function OrderHistoryDrawer({
  isOpen,
  setIsOpen,
  tableId,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tableId: number;
}) {
  const [orders, setOrders] = useState<any[]>([]);

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
                <li key={order.id} className='border-b py-2'>
                  <span>{order.created_at}</span> - {order.total_price}원
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>no order history</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
