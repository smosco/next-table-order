'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash } from 'lucide-react';
import { type MenuItem, type Category, type OptionGroup } from '@/types/schema';
import { Switch } from '@/components/ui/switch';

export default function MenuForm({
  onMenuUpdated,
  menuToEdit,
}: {
  onMenuUpdated: () => void;
  menuToEdit?: MenuItem | null;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 카테고리 불러오기 유지
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/public/categories');
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  // 데이터 유지 + 옵션 그룹 포함
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null as File | null,
    image_url: '',
    options: [] as OptionGroup[],
  };

  const [formData, setFormData] = useState(() =>
    menuToEdit
      ? {
          ...menuToEdit,
          price: menuToEdit.price.toString(),
          image: null,
          image_url: menuToEdit.image_url,
          options: menuToEdit.option_groups ?? [],
        }
      : initialFormState
  );

  useEffect(() => {
    if (menuToEdit) {
      setFormData({
        ...menuToEdit,
        price: menuToEdit.price.toString(),
        image: null,
        image_url: menuToEdit.image_url,
        options: menuToEdit.option_groups ?? [],
      });
    }
  }, [menuToEdit]);

  // 옵션 그룹 추가
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

  // 옵션 추가
  const addOption = (groupIndex: number) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[groupIndex] = {
        ...newOptions[groupIndex],
        options: [
          ...newOptions[groupIndex].options,
          { id: crypto.randomUUID(), name: '', price: 0 },
        ],
      };
      return { ...prev, options: newOptions };
    });
  };

  // 옵션 그룹 수정 (name, is_required, max_select)
  const updateOptionGroup = (
    groupIndex: number,
    key: 'name' | 'is_required' | 'max_select',
    value: string | boolean | number
  ) => {
    setFormData((prev) => {
      const newGroups = [...prev.options];
      (newGroups[groupIndex] as any)[key] = value;
      return { ...prev, options: newGroups };
    });
  };

  // 옵션 수정 (name, price)
  const updateOption = (
    groupIndex: number,
    optionIndex: number,
    key: 'name' | 'price',
    value: string | number
  ) => {
    setFormData((prev) => {
      const newOptions = prev.options.map((group, gIndex) => {
        if (gIndex === groupIndex) {
          return {
            ...group,
            options: group.options.map((option, oIndex) =>
              oIndex === optionIndex ? { ...option, [key]: value } : option
            ),
          };
        }
        return group;
      });
      return { ...prev, options: newOptions };
    });
  };

  // 옵션 그룹 삭제
  const removeOptionGroup = (groupIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, index) => index !== groupIndex),
    }));
  };

  // 옵션 삭제
  const removeOption = (groupIndex: number, optionIndex: number) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[groupIndex].options = newOptions[groupIndex].options.filter(
        (_, index) => index !== optionIndex
      );
      return { ...prev, options: newOptions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;
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

      if (!res.ok) throw new Error('Failed to save menu');

      toast({
        title: 'Success',
        description: menuToEdit ? 'Menu updated!' : 'Menu added!',
      });

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
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          className='space-y-4'
        >
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

          <Label>Image</Label>
          <Input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files?.[0] || null })
            }
          />

          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Label>Description</Label>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

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

          {/* 옵션 그룹 및 옵션 UI */}
          <Label>Options</Label>
          {formData.options.map((group, groupIndex) => (
            <div key={group.id} className='border p-3 mt-2'>
              <Input
                placeholder='Option Group Name'
                value={group.name}
                onChange={(e) =>
                  updateOptionGroup(groupIndex, 'name', e.target.value)
                }
              />

              <Label>Required</Label>
              <Switch
                checked={group.is_required}
                onCheckedChange={(checked) =>
                  updateOptionGroup(groupIndex, 'is_required', checked)
                }
              />

              <Label>Max Select</Label>
              <Input
                type='number'
                value={group.max_select}
                onChange={(e) =>
                  updateOptionGroup(
                    groupIndex,
                    'max_select',
                    Number(e.target.value)
                  )
                }
              />

              {group.options.map((option, optionIndex) => (
                <div key={option.id} className='flex gap-2 mt-2'>
                  <Input
                    placeholder='Option Name'
                    value={option.name}
                    onChange={(e) =>
                      updateOption(
                        groupIndex,
                        optionIndex,
                        'name',
                        e.target.value
                      )
                    }
                  />
                  <Input
                    type='number'
                    placeholder='Price'
                    value={option.price}
                    onChange={(e) =>
                      updateOption(
                        groupIndex,
                        optionIndex,
                        'price',
                        Number(e.target.value)
                      )
                    }
                  />
                  <Button onClick={() => removeOption(groupIndex, optionIndex)}>
                    <Trash className='w-4 h-4' />
                  </Button>
                </div>
              ))}
              <Button type='button' onClick={() => addOption(groupIndex)}>
                Add Option
              </Button>
            </div>
          ))}
          <Button type='button' onClick={addOptionGroup}>
            Add Option Group
          </Button>

          <Button type='submit' disabled={loading} className='w-full'>
            {menuToEdit ? 'Update Menu' : 'Add Menu'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
