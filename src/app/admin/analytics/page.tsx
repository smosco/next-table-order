'use client';

import { useState } from 'react';
import { orders, orderItems, menuItems } from '@/mock/adminMockData';
import type { MenuItem } from '@/types/schema';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SalesSummary = {
  menuItemId: string;
  name: string;
  quantity: number;
  totalSales: number;
  date: string;
};

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function Analytics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] =
    useState<keyof SalesSummary>('totalSales');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('daily');

  const completedOrders = orders.filter((order) => order.status === 'pending');

  const salesSummary: SalesSummary[] = completedOrders.flatMap((order) => {
    return orderItems
      .filter((item) => item.orderId === order.id)
      .map((item) => {
        const menuItem = menuItems.find(
          (mi) => mi.id === item.menuItemId
        ) as MenuItem;
        return {
          menuItemId: item.menuItemId,
          name: menuItem.name,
          quantity: item.quantity,
          totalSales: item.price * item.quantity,
          date: new Date(order.createdAt).toISOString().split('T')[0], // YYYY-MM-DD format
        };
      });
  });

  const filteredSales = salesSummary.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSales = filteredSales.reduce((acc, item) => {
    let key: string;
    switch (timePeriod) {
      case 'daily':
        key = item.date;
        break;
      case 'weekly':
        const date = new Date(item.date);
        const weekStart = new Date(
          date.setDate(date.getDate() - date.getDay())
        );
        const weekEnd = new Date(
          date.setDate(date.getDate() - date.getDay() + 6)
        );
        key = `${weekStart.toISOString().split('T')[0]} to ${
          weekEnd.toISOString().split('T')[0]
        }`;
        break;
      case 'monthly':
        key = item.date.substring(0, 7); // YYYY-MM
        break;
      case 'yearly':
        key = item.date.substring(0, 4); // YYYY
        break;
    }
    if (!acc[key]) {
      acc[key] = { ...item, date: key };
    } else {
      acc[key].quantity += item.quantity;
      acc[key].totalSales += item.totalSales;
    }
    return acc;
  }, {} as Record<string, SalesSummary>);

  const sortedSales = Object.values(groupedSales).sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof SalesSummary) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const totalSales = sortedSales.reduce(
    (sum, item) => sum + item.totalSales,
    0
  );
  const totalQuantity = sortedSales.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold mb-4'>Sales Analytics</h1>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0 md:space-x-2'>
        <Input
          placeholder='Search menu items...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
        <div className='flex space-x-2'>
          <Select
            value={timePeriod}
            onValueChange={(value: TimePeriod) => setTimePeriod(value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select time period' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='daily'>Daily</SelectItem>
              <SelectItem value='weekly'>Weekly</SelectItem>
              <SelectItem value='monthly'>Monthly</SelectItem>
              <SelectItem value='yearly'>Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className='h-[calc(100vh-250px)]'>
        <Table>
          <TableCaption>Sales summary for the selected period</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant='ghost' onClick={() => handleSort('date')}>
                  Date
                </Button>
              </TableHead>
              <TableHead className='w-[300px]'>
                <Button variant='ghost' onClick={() => handleSort('name')}>
                  Menu Item
                </Button>
              </TableHead>
              <TableHead>
                <Button variant='ghost' onClick={() => handleSort('quantity')}>
                  Quantity Sold
                </Button>
              </TableHead>
              <TableHead className='text-right'>
                <Button
                  variant='ghost'
                  onClick={() => handleSort('totalSales')}
                >
                  Total Sales
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSales.map((item) => (
              <TableRow key={`${item.menuItemId}-${item.date}`}>
                <TableCell>{item.date}</TableCell>
                <TableCell className='font-medium'>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className='text-right'>
                  ${item.totalSales.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className='font-bold'>
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell>{totalQuantity}</TableCell>
              <TableCell className='text-right'>
                ${totalSales.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
