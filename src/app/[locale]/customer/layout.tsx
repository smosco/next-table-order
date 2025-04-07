'use client';

import { useState, useEffect } from 'react';
import { CartProvider } from '@/app/CartProvider';
import { CategorySidebar } from '@/components/customer/menu/CategorySidebar';
import { TableInfo } from '@/components/customer/TableInfo';
import { CartDrawer } from '@/components/customer/order/CartDrawer';
import { BottomBar } from '@/components/customer/BottomBar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Table {
  id: number;
  name: string;
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tableId, setTableId] = useState<string | null>(null); // 주문 시 사용
  const [tableName, setTableName] = useState<string | null>(null); // UI 표시용
  const [tables, setTables] = useState<Table[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log({ tableId, tableName });

  // 테이블 목록 불러오기
  useEffect(() => {
    fetch('/api/admin/tables')
      .then((res) => res.json())
      .then((data) => setTables(data));
  }, []);

  useEffect(() => {
    const savedTableId = localStorage.getItem('tableId');
    const savedTableName = localStorage.getItem('tableName');

    if (savedTableId && savedTableName) {
      setTableId(savedTableId);
      setTableName(savedTableName);
    } else {
      setIsDialogOpen(true);
    }
  }, []);

  const handleSetTable = (id: string, name: string) => {
    setTableId(id);
    setTableName(name);
  };

  const handleConfirmTable = () => {
    if (tableId && tableName) {
      localStorage.setItem('tableId', tableId);
      localStorage.setItem('tableName', tableName);
      setIsDialogOpen(false);
    }
  };

  return (
    <CartProvider>
      <div className='flex h-screen bg-background'>
        <CategorySidebar />
        <main className='flex-1 flex flex-col'>
          <TableInfo tableName={tableName || 'No Table Selected'} />
          <div className='flex-1 overflow-auto'>{children}</div>
          <BottomBar />
        </main>
        <CartDrawer />
      </div>

      {/* 테이블 선택 모달 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Table</DialogTitle>
          </DialogHeader>
          <Select
            onValueChange={(value) => {
              const selectedTable = tables.find((t) => String(t.id) === value);
              if (selectedTable) {
                handleSetTable(value, selectedTable.name);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select table' />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table.id} value={String(table.id)}>
                  {table.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleConfirmTable} className='w-full'>
            Confirm
          </Button>
        </DialogContent>
      </Dialog>
    </CartProvider>
  );
}
