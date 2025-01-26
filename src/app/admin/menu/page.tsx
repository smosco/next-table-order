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

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCategory, setNewCategory] = useState<string>('');

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

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Menu Management</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Menu Items */}
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
        </Card>

        {/* Item Add, Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newItem: MenuItem = {
                  id: editingItem ? editingItem.id : '',
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  price: Number.parseFloat(formData.get('price') as string),
                  categoryId: formData.get('categoryId') as string,
                };
                if (editingItem) {
                  handleUpdateItem(newItem);
                } else {
                  handleAddItem(newItem);
                }
                e.currentTarget.reset();
              }}
            >
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    name='name'
                    defaultValue={editingItem?.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='description'>Description</Label>
                  <Input
                    id='description'
                    name='description'
                    defaultValue={editingItem?.description}
                  />
                </div>
                <div>
                  <Label htmlFor='price'>Price</Label>
                  <Input
                    id='price'
                    name='price'
                    type='number'
                    step='0.01'
                    defaultValue={editingItem?.price}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='categoryId'>Category</Label>
                  <Select
                    name='categoryId'
                    defaultValue={editingItem?.categoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type='submit'>
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Update Categories */}
      <Card className='mt-4'>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-2'>
            <Input
              placeholder='New category name'
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAddCategory}>Add Category</Button>
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            {categories.map((category) => (
              <div key={category.id} className='bg-gray-100 px-3 py-1 rounded'>
                {category.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
