import { CartProvider } from '@/app/CartProvider';
import { CategorySidebar } from '@/components/customer/menu/CategorySidebar';
import { TableInfo } from '@/components/customer/TableInfo';
import { CartDrawer } from '@/components/customer/order/CartDrawer';
import { BottomBar } from '@/components/customer/Footer';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className='flex h-screen bg-background'>
        <CategorySidebar />
        <main className='flex-1 flex flex-col'>
          <TableInfo />
          <div className='flex-1 overflow-auto'>{children}</div>
          <BottomBar />
        </main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
