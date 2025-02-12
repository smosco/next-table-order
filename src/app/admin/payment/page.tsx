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

// 현재 테이블이 1~5번까지 있다고 가정
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
  const { toast } = useToast();

  console.log('Fetched orders:', orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  // 활성화된 테이블의 주문 조회 (order_group_id 기준으로 그룹화된 데이터)
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders/active');
      const data = await res.json();
      setOrders(data.orders); // ✅ 이제 orders는 order_group_id 기준으로 묶여 있음
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  // 현재 테이블의 주문 정보 가져오기
  const getOrderByTableId = (tableId: number) =>
    orders.find((order) => order.table_id === tableId) || null;

  // 테이블 주문 닫기 (order_group 종료)
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

      fetchOrders(); // 주문 목록 새로고침
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to close table',
      });
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold mb-4'>Admin Orders</h1>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {tables.map((table) => {
          const order = getOrderByTableId(table.id);

          return (
            <Card key={table.id} className='flex flex-col justify-between'>
              <CardContent className='pt-6'>
                <h2 className='text-xl font-bold mb-2'>{table.name}</h2>
                {order ? (
                  <>
                    <p className='mb-2 font-bold'>
                      Total: ${order.total_price.toFixed(2)}
                    </p>
                    <Button
                      className='w-full mb-2'
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsSheetOpen(true);
                      }}
                    >
                      View Order
                    </Button>
                    <Button
                      className='w-full'
                      variant='destructive'
                      onClick={() => closeTable(table.id)}
                    >
                      Close Table
                    </Button>
                  </>
                ) : (
                  <p className='text-gray-500'>No active orders</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 주문 상세 Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side='right'>
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
            <SheetClose asChild>
              <Button variant='ghost'>Close</Button>
            </SheetClose>
          </SheetHeader>
          <div className='p-4'>
            {selectedOrder && (
              <>
                <h2 className='text-xl font-bold mb-2'>
                  {tables.find((t) => t.id === selectedOrder.table_id)?.name}
                </h2>
                <p className='mb-4 font-bold'>
                  Total: ${selectedOrder.total_price.toFixed(2)}
                </p>
                <ScrollArea className='max-h-[300px]'>
                  {selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div key={index} className='flex justify-between py-2'>
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-500'>No items found</p>
                  )}
                </ScrollArea>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
