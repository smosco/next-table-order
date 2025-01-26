'use client';

import { useState } from 'react';
import {
  orders as initialOrders,
  tables,
  orderItems,
  menuItems,
} from '@/mock/adminMockData';
import {
  type Order,
  Table,
  type OrderItem,
  type MenuItem,
} from '@/types/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Payment() {
  const [orders, setOrders] = useState<Order[]>(
    initialOrders.filter((order) => order.status === 'pending')
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const getTableName = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId);
    return table ? table.name : 'Unknown Table';
  };

  const getOrderItems = (
    orderId: string
  ): (OrderItem & { menuItem: MenuItem })[] => {
    return orderItems
      .filter((item) => item.orderId === orderId)
      .map((item) => ({
        ...item,
        menuItem: menuItems.find(
          (menuItem) => menuItem.id === item.menuItemId
        ) as MenuItem,
      }));
  };

  const handlePayment = (order: Order) => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    alert(
      `Payment of $${order.totalPrice.toFixed(
        2
      )} processed successfully for ${getTableName(
        order.tableId
      )} using ${paymentMethod}`
    );
    setOrders(orders.filter((o) => o.id !== order.id));
    setSelectedOrder(null);
    setPaymentMethod('');
  };

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold mb-4'>Payment</h1>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {tables.map((table) => {
          const order = orders.find((o) => o.tableId === table.id);
          return (
            <Card key={table.id} className='flex flex-col justify-between'>
              <CardContent className='pt-6'>
                <h2 className='text-xl font-bold mb-2'>{table.name}</h2>
                {order ? (
                  <>
                    <p className='mb-4'>
                      Total: ${order.totalPrice.toFixed(2)}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className='w-full'
                          onClick={() => setSelectedOrder(order)}
                        >
                          Pay
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {getTableName(order.tableId)} Order Details
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className='max-h-[300px] mt-4'>
                          {getOrderItems(order.id).map((item) => (
                            <div
                              key={item.id}
                              className='flex justify-between py-2'
                            >
                              <span>
                                {item.menuItem.name} x {item.quantity}
                              </span>
                              <span>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </ScrollArea>
                        <div className='font-bold text-lg mt-4'>
                          Total: ${order.totalPrice.toFixed(2)}
                        </div>
                        <Select
                          onValueChange={setPaymentMethod}
                          value={paymentMethod}
                        >
                          <SelectTrigger className='w-full mt-4'>
                            <SelectValue placeholder='Select payment method' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='cash'>Cash</SelectItem>
                            <SelectItem value='card'>Card</SelectItem>
                            <SelectItem value='mobile'>
                              Mobile Payment
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <DialogFooter>
                          <Button
                            onClick={() => handlePayment(order)}
                            className='w-full mt-4'
                          >
                            Confirm Payment
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <p className='text-gray-500'>No pending order</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
