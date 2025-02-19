'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MenuList from '@/components/admin/menu/MenuList';
import CategoryManager from '@/components/admin/menu/CategoryManager';
import MenuForm from '@/components/admin/menu/MenuForm';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();

  const handleMenuAdded = () => {
    router.push('/admin/menu');
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Menu Management</h2>

      <Tabs defaultValue='menu'>
        <TabsList className='mb-4'>
          <TabsTrigger value='menu'>Menus</TabsTrigger>
          <TabsTrigger value='categories'>Categories</TabsTrigger>
          <TabsTrigger value='add'>Add Menu</TabsTrigger>
        </TabsList>

        <TabsContent value='menu'>
          <MenuList />
        </TabsContent>

        <TabsContent value='categories'>
          <CategoryManager />
        </TabsContent>

        <TabsContent value='add'>
          {/* 추가 모드에서는 menuToEdit 없이 사용 */}
          <MenuForm onMenuUpdated={handleMenuAdded} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
