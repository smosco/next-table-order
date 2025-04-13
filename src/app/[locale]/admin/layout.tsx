'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
// import { AdminHeader } from '@/components/admin/Header';
// import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // const { user, isLoading } = useAuth();

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push('/admin/login');
  //   }
  // }, [user, isLoading, router]);

  return (
    <>
      <div className='flex flex-col h-screen'>
        {/* <AdminHeader />  */}
        <div className='flex flex-1 overflow-hidden'>
          <Sidebar />
          <main className='flex-1 overflow-y-auto bg-background'>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
