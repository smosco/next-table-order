'use client';

import { useState, useEffect } from 'react';
import { type MenuItem } from '@/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import MenuForm from '@/components/admin/menu/MenuForm';
import CategoryManager from '@/components/admin/menu/CategoryManager';
import { useToast } from '@/hooks/use-toast';

type Category = {
  id: string;
  name: string;
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const { toast } = useToast();

  // 카테고리 & 메뉴 데이터 불러오기
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, menusRes] = await Promise.all([
          fetch('/api/public/categories'),
          fetch('/api/public/menus'), // 메뉴도 서버에서 불러오기
        ]);

        const [categoriesData, menusData] = await Promise.all([
          categoriesRes.json(),
          menusRes.json(),
        ]);

        setCategories(categoriesData);
        setItems(menusData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // 메뉴 추가 및 수정 후 목록 갱신
  const handleMenuUpdated = async () => {
    try {
      const response = await fetch('/api/admin/menus'); // 서버에서 최신 메뉴 목록 불러오기
      const data = await response.json();
      setItems(data);
      setEditingItem(null); // 수정 후 폼 초기화
    } catch (error) {
      console.error('Error updating menu list:', error);
    }
  };

  // 메뉴 삭제 핸들러
  const handleDeleteMenu = async (menuId: string) => {
    try {
      const response = await fetch(`/api/admin/menus?menuId=${menuId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast({ title: 'Success', description: 'Menu deleted successfully!' });

      // 메뉴 목록 갱신
      setItems(items.filter((item) => item.id !== menuId));
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to delete menu',
      });
    }
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Menu Management</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* 메뉴 목록 테이블 */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {categories.find((c) => c.id === item.categoryId)?.name}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='outline'
                        size='sm'
                        className='mr-2'
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteMenu(item.id!)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 메뉴 추가 및 수정 폼 */}
        <MenuForm
          categories={categories}
          onMenuUpdated={handleMenuUpdated} // 메뉴 목록 갱신
          menuToEdit={editingItem} // 수정할 아이템 전달
        />
      </div>

      {/* 카테고리 관리 */}
      <CategoryManager />
    </div>
  );
}
