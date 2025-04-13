'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { MenuItem } from '@/types/schema';

interface Props {
  onEditMenu: (menu: MenuItem) => void;
}

const fetchMenus = async (): Promise<MenuItem[]> => {
  const res = await fetch('/api/admin/menus');
  if (!res.ok) throw new Error('Failed to fetch menus');
  return res.json();
};

export default function MenuList({ onEditMenu }: Props) {
  const queryClient = useQueryClient();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['menus'],
    queryFn: fetchMenus,
  });

  const patchMenu = useMutation({
    mutationFn: async ({
      menuId,
      updates,
    }: {
      menuId: string;
      updates: Partial<MenuItem>;
    }) => {
      const res = await fetch('/api/admin/menus', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId, ...updates }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Update failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });

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

      // PATCH 요청으로 이미지 URL 반영
      patchMenu.mutate({ menuId, updates: { image_url: data.imageUrl } });
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
        {isLoading ? (
          <div className='text-sm text-gray-500 p-4'>불러오는 중...</div>
        ) : (
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
                        const newStatus = checked ? 'sold_out' : 'available';
                        if (!item.id) return;
                        patchMenu.mutate({
                          menuId: item.id,
                          updates: { status: newStatus },
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
