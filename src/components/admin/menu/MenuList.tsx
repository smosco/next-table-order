'use client';

import { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { MenuItem } from '@/types/schema';

export default function MenuList({
  onEditMenu,
}: {
  onEditMenu: (menu: MenuItem) => void;
}) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch('/api/public/menus');
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    }
    fetchMenus();
  }, []);

  const handleImageUpload = async (menuId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Image upload failed');

      // 업로드 성공 시 상태 업데이트
      setItems((prev) =>
        prev.map((item) =>
          item.id === menuId ? { ...item, image_url: data.imageUrl } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-col gap-1'>
        <CardTitle className='text-lg'>상품(총 {items.length}개)</CardTitle>
        <div className='text-sm text-gray-500'>품절 표시</div>
      </CardHeader>
      <CardContent className='overflow-x-auto'>
        <Table>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id} className='hover:bg-gray-50'>
                <TableCell
                  className='w-28 cursor-pointer'
                  onClick={() => fileInputRefs.current[index]?.click()}
                >
                  <div className='w-16 h-16 bg-gray-100 border rounded-lg flex items-center justify-center overflow-hidden'>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className='object-cover w-full h-full'
                      />
                    ) : (
                      <span className='text-xs text-gray-400'>+ 이미지</span>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      ref={(el) => {
                        fileInputRefs.current[index] = el;
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && item.id) {
                          handleImageUpload(item.id, file);
                        }
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => onEditMenu(item)}
                  className='cursor-pointer'
                >
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>{item.name}</span>
                    <span className='text-sm text-gray-500'>
                      {item.price?.toLocaleString()}원
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.status === 'sold_out'}
                    onCheckedChange={(checked) => {
                      // 추후 품절 API 붙일 때 처리
                      console.log(`품절 상태 변경: ${item.id} → ${checked}`);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
