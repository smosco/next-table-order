'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  type MenuItem,
  type Category,
  type OptionGroup,
  type Option,
} from '@/types/schema';
import { Plus, Trash } from 'lucide-react';

export default function MenuForm({
  categories,
  onMenuUpdated,
  menuToEdit,
}: {
  categories: Category[];
  onMenuUpdated: () => void;
  menuToEdit?: MenuItem | null;
}) {
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null as File | null, // image 필드 유지
    image_url: '',
    options: [] as OptionGroup[],
  };

  const [formData, setFormData] = useState(() => {
    return menuToEdit
      ? {
          ...menuToEdit,
          price: menuToEdit.price.toString(),
          image: null, // 새 이미지 업로드 시 사용
          image_url: menuToEdit.image_url, // 기존 이미지 경로 유지
          options: menuToEdit?.options ?? [], // undefined 방지
        }
      : initialFormState;
  });

  console.log(formData);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 옵션 그룹 추가 (1개씩 정상적으로 추가)
  const addOptionGroup = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id: crypto.randomUUID(),
          name: '',
          is_required: false,
          max_select: 1,
          options: [],
        },
      ],
    }));
  };

  // 개별 옵션 추가 (1개씩 정상적으로 추가)
  const addOption = (groupIndex: number) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[groupIndex] = {
        ...newOptions[groupIndex],
        options: [
          ...newOptions[groupIndex].options,
          {
            id: crypto.randomUUID(),
            name: '',
            price: 0,
          },
        ],
      };

      return { ...prev, options: newOptions };
    });
  };

  // 폼 제출 (한 번만 실행되도록 설정)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url; // 기존 이미지 URL 유지

      // 새 이미지 업로드 처리
      if (formData.image) {
        const uploadForm = new FormData();
        uploadForm.append('image', formData.image);
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: uploadForm,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Image upload failed.');
        imageUrl = data.imageUrl;
      }

      // 메뉴 추가 또는 수정 요청
      const apiUrl = menuToEdit
        ? `/api/admin/menus/${menuToEdit.id}`
        : '/api/admin/menus';
      const method = menuToEdit ? 'PUT' : 'POST';

      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category_id: formData.categoryId,
          image_url: imageUrl,
          options: formData.options,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast({
        title: 'Success',
        description: menuToEdit ? 'Menu updated!' : 'Menu added!',
      });

      // 폼 초기화
      setFormData(initialFormState);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onMenuUpdated();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Unexpected error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {menuToEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label>Image</Label>
            <Input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files?.[0] || null,
                })
              }
            />
            {formData.image_url && !formData.image && (
              <p className='text-sm text-gray-500'>
                Current: {formData.image_url}
              </p>
            )}
          </div>

          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Price</Label>
            <Input
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
            <Label>Category</Label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              <option value=''>Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 옵션 추가 UI */}
          {/* 옵션 추가 UI */}
          <div className='mt-4'>
            <h3 className='text-lg font-semibold'>Options</h3>
            {formData.options.map((group, groupIndex) => (
              <div key={group.id} className='border p-3 mt-2'>
                {/* 옵션 그룹 이름 입력 */}
                <Input
                  placeholder='Option Group Name'
                  value={group.name}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[groupIndex].name = e.target.value;
                    setFormData({ ...formData, options: newOptions });
                  }}
                />

                {/* 옵션 리스트 */}
                <div className='mt-2 space-y-2'>
                  {group.options.map((option, optionIndex) => (
                    <div key={option.id} className='flex gap-2 items-center'>
                      {/* 옵션 이름 입력 */}
                      <Input
                        placeholder='Option Name'
                        value={option.name}
                        onChange={(e) => {
                          const updatedOptions = [...formData.options];
                          updatedOptions[groupIndex].options[optionIndex].name =
                            e.target.value;
                          setFormData({ ...formData, options: updatedOptions });
                        }}
                      />

                      {/* 옵션 가격 입력 */}
                      <Input
                        type='number'
                        placeholder='Price'
                        value={option.price.toString()}
                        onChange={(e) => {
                          const updatedOptions = [...formData.options];
                          updatedOptions[groupIndex].options[
                            optionIndex
                          ].price = parseFloat(e.target.value);
                          setFormData({ ...formData, options: updatedOptions });
                        }}
                      />

                      {/* 옵션 삭제 버튼 */}
                      <Button
                        variant='destructive'
                        onClick={() => {
                          const updatedOptions = [...formData.options];
                          updatedOptions[groupIndex].options = updatedOptions[
                            groupIndex
                          ].options.filter((_, i) => i !== optionIndex);
                          setFormData({ ...formData, options: updatedOptions });
                        }}
                      >
                        <Trash className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* 개별 옵션 추가 버튼 */}
                <Button type='button' onClick={() => addOption(groupIndex)}>
                  <Plus className='w-4 h-4' /> Add Option
                </Button>
              </div>
            ))}

            {/* 옵션 그룹 추가 버튼 */}
            <Button type='button' onClick={addOptionGroup}>
              <Plus className='w-4 h-4' /> Add Option Group
            </Button>
          </div>

          <Button type='submit' disabled={loading} className='w-full'>
            {loading
              ? 'Saving...'
              : menuToEdit
              ? 'Update Menu Item'
              : 'Add Menu Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
