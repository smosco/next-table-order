'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MenuList from '@/components/admin/menu/MenuList';
import CategoryManager from '@/components/admin/menu/CategoryManager';
import MenuForm from '@/components/admin/menu/MenuForm';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();
  const t = useTranslations('AdminMenuPage');

  const handleMenuAdded = () => {
    router.push('/admin/menus');
  };

  return (
    <div className='py-20 px-4'>
      <h2 className='text-2xl font-bold mb-4'>{t('title')}</h2>

      <Tabs defaultValue='menu'>
        <TabsList className='mb-4'>
          <TabsTrigger value='menu'>{t('tabs.menu')}</TabsTrigger>
          <TabsTrigger value='categories'>{t('tabs.categories')}</TabsTrigger>
          <TabsTrigger value='add'>{t('tabs.add')}</TabsTrigger>
        </TabsList>

        <TabsContent value='menu'>
          <MenuList />
        </TabsContent>

        <TabsContent value='categories'>
          <CategoryManager />
        </TabsContent>

        <TabsContent value='add'>
          <MenuForm onMenuUpdated={handleMenuAdded} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
