import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className='flex h-screen overflow-hidden'>
        <Sidebar />
        <main className='flex-1 overflow-y-auto bg-background'>{children}</main>
      </div>
    </>
  );
}
