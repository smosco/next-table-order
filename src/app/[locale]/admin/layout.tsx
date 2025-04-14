'use client';

import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className='flex flex-col h-screen'>
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar />
          <main className='flex-1 overflow-y-auto bg-background pt-24 p-8'>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
