'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// 타입 정의
type PopularMenuItem = {
  menuId: string;
  menuName: string;
  quantitySold: number;
  totalRevenue: number;
};

export function PopularItems({ range }: { range: string }) {
  const [items, setItems] = useState<PopularMenuItem[]>([]);

  useEffect(() => {
    async function fetchPopularItems() {
      const res = await fetch(`/api/admin/sales/top-menus?range=${range}`);
      const json = await res.json();
      setItems(json);
    }
    fetchPopularItems();
  }, [range]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Menu Item</TableHead>
          <TableHead>Sold Quantity</TableHead>
          <TableHead>Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.menuId}>
            <TableCell>{item.menuName}</TableCell>
            <TableCell>{item.quantitySold} sold</TableCell>
            <TableCell>{item.totalRevenue.toLocaleString()} ₩</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
