'use client';

import type React from 'react';
import { useState } from 'react';
import { orders, orderItems, menuItems } from '@/mock/adminMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('7');

  const getTotalSales = (): number => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
  };

  const getTotalItemsSold = (): number => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getPopularItems = (): { name: string; quantity: number }[] => {
    const itemCounts: { [key: string]: number } = {};
    orderItems.forEach((item) => {
      itemCounts[item.menuItemId] =
        (itemCounts[item.menuItemId] || 0) + item.quantity;
    });
    return Object.entries(itemCounts)
      .map(([menuItemId, quantity]) => ({
        name:
          menuItems.find((item) => item.id === menuItemId)?.name || 'Unknown',
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  const getSalesData = (): { date: string; sales: number }[] => {
    const days = Number.parseInt(dateRange);
    const salesData: { [key: string]: number } = {};
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      salesData[d.toISOString().split('T')[0]] = 0;
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= startDate && orderDate <= endDate) {
        const dateKey = orderDate.toISOString().split('T')[0];
        salesData[dateKey] = (salesData[dateKey] || 0) + order.totalPrice;
      }
    });

    return Object.entries(salesData).map(([date, sales]) => ({ date, sales }));
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Dashboard</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>${getTotalSales().toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{getTotalItemsSold()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setDateRange} defaultValue={dateRange}>
              <SelectTrigger>
                <SelectValue placeholder='Select date range' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='7'>Last 7 days</SelectItem>
                <SelectItem value='30'>Last 30 days</SelectItem>
                <SelectItem value='90'>Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={getSalesData()}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='sales' stroke='#8884d8' />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {getPopularItems().map((item, index) => (
                <li key={index} className='flex justify-between'>
                  <span>{item.name}</span>
                  <span>{item.quantity} sold</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
