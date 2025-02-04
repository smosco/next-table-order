'use client';

import type React from 'react';
import { useState } from 'react';
import { menuItems, categories } from '@/mock/adminMockData';
import { type MenuItem } from '@/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import MenuForm from '@/components/admin/menu/MenuForm';
import CategoryManager from '@/components/admin/menu/CategoryManager';
import { useEffect } from 'react';

type Category = {
  id: string;
  name: string;
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCategory, setNewCategory] = useState<string>('');

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/public/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  const handleAddItem = (item: MenuItem) => {
    setItems([...items, { ...item, id: `item-${Date.now()}` }]);
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddCategory = () => {
    if (newCategory) {
      categories.push({ id: `category-${Date.now()}`, name: newCategory });
      setNewCategory('');
    }
  };

  const handleMenuAdded = (newItem: MenuItem) => {
    setItems([...items, newItem]);
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Menu Management</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Menu Items */}
        {/* <Card>
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
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card> */}

        {/* Item Add, Edit Form */}
        <MenuForm categories={categories} onMenuAdded={handleMenuAdded} />
      </div>

      {/* Update Categories */}
      <CategoryManager />
    </div>
  );
}
