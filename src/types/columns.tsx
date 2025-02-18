'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Order = {
  order_id: string;
  table_id: number;
  total_price: number;
  order_status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  items: {
    menu_name: string;
    quantity: number;
    price: number;
  }[];
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'table_id',
    header: '테이블 번호',
  },
  {
    accessorKey: 'order_id',
    header: '주문 ID',
  },
  {
    accessorKey: 'total_price',
    header: '총 가격',
  },
  {
    accessorKey: 'payment_method',
    header: '결제 수단',
  },
  {
    accessorKey: 'order_status',
    header: '주문 상태',
  },
  {
    accessorKey: 'payment_status',
    header: '결제 상태',
  },
  {
    accessorKey: 'created_at',
    header: '주문 시간',
  },
  {
    accessorKey: 'items',
    header: '주문한 메뉴',
    cell: ({ getValue }) => {
      const items = getValue() as Order['items'];
      return items
        .map((item) => `${item.menu_name} (${item.quantity}개)`)
        .join(', ');
    },
  },
];
