'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { type MenuItem, type Category } from '@/types/schema';

interface MenuFormProps {
  categories: Category[];
  onMenuAdded: (newItem: MenuItem) => void;
}

export default function MenuForm({ categories, onMenuAdded }: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 이미지 업로드 함수
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Image upload failed.');

      return data.imageUrl; // 성공 시 URL 반환
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Unexpected error occurred.'
      );
    }
  };

  // 메뉴 추가 함수
  const createMenu = async (imageUrl: string) => {
    try {
      const res = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category_id: formData.categoryId,
          image_url: imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Menu creation failed.');

      return data; // 성공 시 데이터 반환
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Unexpected error occurred.'
      );
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.image) {
      setError('Please select an image.');
      setLoading(false);
      return;
    }

    try {
      // 1. 이미지 업로드
      const imageUrl = await uploadImage(formData.image);

      // 2. 메뉴 추가
      const newItem = await createMenu(imageUrl);

      // 3️. 성공 메시지 & 폼 리셋
      setSuccess('Menu has been added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        image: null,
      });

      // 브라우저 파일 입력 필드 리셋
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // 4️. 부모 컴포넌트에 추가된 메뉴 전달 (목록 갱신)
      onMenuAdded(newItem);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Menu Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && <p className='text-red-500'>{error}</p>}
          {success && <p className='text-green-500'>{success}</p>}

          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor='price'>Price</Label>
            <Input
              id='price'
              type='number'
              step='0.01'
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor='categoryId'>Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
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
          <div>
            <Label htmlFor='image'>Image</Label>
            <Input
              id='image'
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files?.[0] || null })
              }
              required
            />
          </div>

          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Uploading...' : 'Add Menu Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
