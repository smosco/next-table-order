'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { MenuItem, Category, OptionGroup } from '@/types/schema';
import { useToast } from '@/hooks/use-toast';
import CategoryModal from './CategoryModal';
import OptionModal from './OptionModal';

interface MenuFormModalProps {
  open: boolean;
  onClose: () => void;
  onMenuUpdated: () => void;
  menuToEdit?: MenuItem | null;
}

export default function MenuFormModal({
  open,
  onClose,
  onMenuUpdated,
  menuToEdit,
}: MenuFormModalProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [options, setOptions] = useState<OptionGroup[]>([]);
  const [formData, setFormData] = useState<MenuItem>({
    id: menuToEdit?.id || '',
    name: menuToEdit?.name || '',
    description: menuToEdit?.description || '',
    price: menuToEdit?.price || 0,
    category_id: menuToEdit?.category_id || '',
    options: menuToEdit?.options || [],
    image_url: menuToEdit?.image_url || '',
    status: menuToEdit?.status || 'available',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchOptions();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/public/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast({ title: '카테고리 불러오기 실패', variant: 'destructive' });
    }
  };

  const fetchOptions = async () => {
    try {
      const res = await fetch('/api/admin/options');
      const data = await res.json();
      setOptions(data);
    } catch (err) {
      toast({ title: '옵션 불러오기 실패', variant: 'destructive' });
    }
  };

  const handleImageUpload = async (file: File) => {
    const form = new FormData();
    form.append('image', file);

    const res = await fetch('/api/admin/upload-image', {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.imageUrl;
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.image_url;
      if (
        formData.image_url &&
        formData.image_url.startsWith('blob:') &&
        fileInputRef.current?.files?.[0]
      ) {
        imageUrl = await handleImageUpload(fileInputRef.current.files[0]);
      }

      const payload = { ...formData, image_url: imageUrl };
      const res = await fetch('/api/admin/menus', {
        method: menuToEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '저장 실패');
      }

      toast({ title: menuToEdit ? '수정 완료' : '등록 완료' });
      onMenuUpdated();
      onClose();
    } catch (err) {
      toast({
        title: '오류 발생',
        description: err instanceof Error ? err.message : '알 수 없는 오류',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{menuToEdit ? '상품 수정' : '상품 추가'}</DialogTitle>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div>
              <Label>상품이름</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>카테고리 선택</Label>
              <div className='flex gap-2 flex-wrap'>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={
                      formData.category_id === cat.id ? 'default' : 'outline'
                    }
                    onClick={() =>
                      setFormData({ ...formData, category_id: cat.id })
                    }
                  >
                    {cat.name}
                  </Button>
                ))}
                <Button
                  variant='ghost'
                  onClick={() => setShowCategoryModal(true)}
                >
                  + 새 카테고리 등록
                </Button>
              </div>
            </div>

            <div>
              <Label>기본 가격</Label>
              <Input
                type='number'
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>상품에 넣을 옵션을 선택하세요</Label>
              <div className='flex gap-2 flex-wrap'>
                {options.map((opt) => (
                  <Button
                    key={opt.id}
                    variant={
                      formData.options?.some((o) => o.id === opt.id)
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() => {
                      const exists = formData.options?.some(
                        (o) => o.id === opt.id
                      );
                      const newOptions = exists
                        ? formData.options?.filter((o) => o.id !== opt.id)
                        : [...(formData.options || []), opt];
                      setFormData({ ...formData, options: newOptions });
                    }}
                  >
                    {opt.name}
                  </Button>
                ))}
                <Button
                  variant='ghost'
                  onClick={() => setShowOptionModal(true)}
                >
                  + 새옵션 추가
                </Button>
              </div>
            </div>

            <div>
              <Label>이미지</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className='w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center cursor-pointer overflow-hidden'
              >
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt='preview'
                    className='object-cover w-full h-full'
                  />
                ) : (
                  <span className='text-sm text-gray-400'>+ 이미지</span>
                )}
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        image_url: URL.createObjectURL(file),
                      });
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <Label>품절 여부</Label>
              <Switch
                checked={formData.status === 'sold_out'}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    status: checked ? 'sold_out' : 'available',
                  })
                }
              />
            </div>
          </div>

          <div className='flex justify-between pt-4'>
            {menuToEdit && (
              <Button
                variant='destructive'
                onClick={() => toast({ title: '삭제 로직 구현 필요' })}
              >
                삭제
              </Button>
            )}
            <div className='ml-auto flex gap-2'>
              <Button variant='outline' onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleSubmit}>
                {menuToEdit ? '확인' : '등록'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <CategoryModal
        open={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          fetchCategories(); // 카테고리 갱신
        }}
      />
      <OptionModal
        open={showOptionModal}
        onClose={() => setShowOptionModal(false)}
      />
    </>
  );
}
