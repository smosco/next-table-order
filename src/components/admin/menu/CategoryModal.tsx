'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Category } from '@/types/schema';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CategoryModal({ open, onClose }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // 카테고리 불러오기
  useEffect(() => {
    if (!open) return;
    fetch('/api/public/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, [open]);

  // 카테고리 추가
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName }),
    });

    if (res.ok) {
      const { id } = await res.json();
      setCategories((prev) => [...prev, { id, name: newCategoryName }]);
      setNewCategoryName('');
    }
  };

  // 카테고리 수정
  const handleUpdateCategory = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName }),
    });

    if (res.ok) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editingName } : c))
      );
      setEditingId(null);
      setEditingName('');
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold'>카테고리 관리</DialogTitle>
        </DialogHeader>

        <div className='flex gap-2 mb-4'>
          <Input
            placeholder='새로운 카테고리 이름'
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
          >
            저장
          </Button>
        </div>

        <div className='space-y-2 max-h-[50vh] overflow-y-auto'>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className='flex items-center justify-between border-b py-2'
            >
              {editingId === cat.id ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className='flex-1 mr-2'
                />
              ) : (
                <span className='flex-1 font-medium'>{cat.name}</span>
              )}

              <div className='flex gap-2'>
                {editingId === cat.id ? (
                  <Button
                    size='sm'
                    onClick={() => handleUpdateCategory(cat.id)}
                  >
                    저장
                  </Button>
                ) : (
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditingName(cat.name);
                    }}
                  >
                    수정
                  </Button>
                )}
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
