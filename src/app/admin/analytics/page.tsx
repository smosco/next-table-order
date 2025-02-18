'use client';

import { DataTable } from '@/components/DataTable';
import { columns } from '@/types/columns';
import useOrders from '@/hooks/useOrders';

export default function OrdersPage() {
  const { data, isLoading, error } = useOrders();

  if (error)
    return <p className='text-red-500'>데이터를 불러오는 중 오류 발생</p>;

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-2xl font-semibold mb-4'>판매 데이터</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={data?.orders || []} />
      )}
    </div>
  );
}
