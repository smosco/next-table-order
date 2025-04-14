'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Table {
  id: number;
  name: string;
}

export default function TableManagementPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [newTableName, setNewTableName] = useState('');

  // 테이블 목록 불러오기
  useEffect(() => {
    fetch('/api/admin/tables')
      .then((res) => res.json())
      .then((data) => setTables(data));
  }, []);

  // 테이블 추가
  const addTable = async () => {
    if (!newTableName.trim()) return;
    const res = await fetch('/api/admin/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTableName }),
    });
    if (res.ok) {
      setTables([...tables, await res.json()]);
      setNewTableName('');
    }
  };

  // 테이블 삭제
  const deleteTable = async (id: number) => {
    const res = await fetch(`/api/admin/tables/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTables(tables.filter((table) => table.id !== id));
    }
  };

  return (
    <div className='space-y-4'>
      <h1 className='text-xl font-bold'>테이블 관리</h1>

      {/* 테이블 추가 */}
      <div className='flex gap-2'>
        <Input
          placeholder='테이블 이름'
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
        <Button onClick={addTable}>추가</Button>
      </div>

      {/* 테이블 목록 */}
      <ul className='space-y-2'>
        {tables.map((table) => (
          <li
            key={table.id}
            className='flex justify-between p-2 border rounded'
          >
            <span>{table.name}</span>
            <Button variant='destructive' onClick={() => deleteTable(table.id)}>
              삭제
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
