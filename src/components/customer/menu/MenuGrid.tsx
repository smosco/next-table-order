'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import MenuDetailModal from './MenuDetailModal';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
}

export function MenuGrid() {
  const router = useRouter();
  const [menuItems, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/public/menus`);
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const groupedMenus = useMemo(() => {
    return menuItems.reduce<{ [key: string]: MenuItem[] }>((acc, item) => {
      if (!acc[item.category_id]) acc[item.category_id] = [];
      acc[item.category_id].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  const handleScroll = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!menuRef.current) return;

      const sections = document.querySelectorAll("[id^='category-']");
      let currentCategory = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentCategory = section.id.replace('category-', '');
        }
      });

      if (currentCategory) {
        router.replace(`/customer/menu#${currentCategory}`, {
          scroll: false,
        });
      }
    }, 200);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    const ref = menuRef.current;

    ref.addEventListener('scroll', handleScroll);
    return () => ref.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={menuRef}
      className='p-4 h-[900px] overflow-y-auto border border-gray-400'
    >
      {Object.entries(groupedMenus).map(([category, items]) => (
        <div key={category} id={`category-${category}`} className='mb-8'>
          <h2 className='text-2xl font-bold mb-4'>{category}</h2>
          <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
            {items.map((item) => (
              <Card
                key={item.id}
                className='overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105'
                onClick={() => setSelectedMenuId(item.id)}
              >
                <Image
                  src={item.image_url || '/placeholder.png'}
                  alt={item.name}
                  width={343}
                  height={160}
                  className='w-full h-40 object-cover'
                />
                <CardContent className='p-4'>
                  <h3 className='text-lg font-semibold mb-2'>{item.name}</h3>
                  <p className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                    {item.description}
                  </p>
                  <div className='flex justify-between items-center'>
                    <Badge variant='secondary' className='text-lg'>
                      {item.price.toLocaleString()} ₩
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* 메뉴 상세 모달 */}
      {!!selectedMenuId && (
        <MenuDetailModal
          menuId={selectedMenuId}
          onClose={() => setSelectedMenuId(null)}
        />
      )}
    </div>
  );
}
