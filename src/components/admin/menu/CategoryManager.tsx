'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Category = {
  id: string;
  name: string;
};

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // 카테고리 목록 가져오기 (GET)
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

  // 카테고리 추가 (POST)
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });

      const data = await res.json();
      if (res.ok) {
        setCategories([...categories, { id: data.id, name: newCategory }]);
        setNewCategory('');
      } else {
        alert(data.error || 'Failed to add category.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // 카테고리 수정 (PATCH)
  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategory.name }),
      });

      const data = await res.json();
      if (res.ok) {
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id
              ? { ...cat, name: editingCategory.name }
              : cat
          )
        );
        setEditingCategory(null);
      } else {
        alert(data.error || 'Failed to update category.');
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // 카테고리 삭제 (DELETE)
  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCategories(categories.filter((cat) => cat.id !== id));
      } else {
        alert('Failed to delete category.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 카테고리 추가 */}
        <div className='flex space-x-2 mb-4'>
          <Input
            placeholder='New category name'
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button onClick={handleAddCategory}>Add</Button>
        </div>

        {/* 카테고리 리스트 */}
        <div className='space-y-2'>
          {categories.map((category) => (
            <div
              key={category.id}
              className='flex items-center justify-between bg-gray-100 px-3 py-1 rounded'
            >
              {editingCategory?.id === category.id ? (
                <Input
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                />
              ) : (
                <span>{category.name}</span>
              )}

              <div className='flex space-x-2'>
                {editingCategory?.id === category.id ? (
                  <Button size='sm' onClick={handleUpdateCategory}>
                    Save
                  </Button>
                ) : (
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => setEditingCategory(category)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
