'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import MenuDetailModal from './MenuDetailModal';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { motion } from 'framer-motion';

interface Option {
  id: string;
  name: string;
  price: number;
}

interface OptionGroup {
  id: string;
  name: string;
  is_required: boolean;
  max_select: number;
  options: Option[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  option_groups: OptionGroup[];
}

export function MenuGrid() {
  const { activeCategory, setActiveCategory } = useCategoryStore();
  const queryClient = useQueryClient();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['menus'],
    queryFn: async () => {
      const response = await fetch('/api/public/menus');
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1시간 동안 유지
  });

  useEffect(() => {
    if (menuItems.length > 0) {
      menuItems.forEach((menu: MenuItem) => {
        queryClient.setQueryData(['menu', menu.id], menu);
      });
    }
  }, [menuItems, queryClient]);

  const groupedMenus = useMemo(() => {
    return menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      if (!acc[item.category_id]) acc[item.category_id] = [];
      acc[item.category_id].push(item);
      return acc;
    }, {});
  }, [menuItems]);

  return (
    <div className='flex flex-col h-full'>
      <div
        ref={menuRef}
        className='flex-1 overflow-y-auto px-6 py-8 space-y-12'
      >
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          Object.entries(groupedMenus).map(([category, items]) => (
            <div key={category} id={`category-${category}`}>
              <h2 className='text-2xl font-bold mb-6 text-toss-gray-900'>
                {category}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className='overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105'
                      onClick={() => setSelectedMenuId(item.id)}
                    >
                      <Image
                        src={item.image_url || '/placeholder.png'}
                        alt={item.name}
                        width={343}
                        height={200}
                        className='w-full h-48 object-cover'
                      />
                      <CardContent className='p-4'>
                        <h3 className='text-lg font-semibold mb-2 text-toss-gray-900'>
                          {item.name}
                        </h3>
                        <p className='text-sm text-toss-gray-600 mb-3 line-clamp-2'>
                          {item.description}
                        </p>
                        <Badge
                          variant='secondary'
                          className='text-lg bg-toss-blue-light text-toss-blue'
                        >
                          {item.price.toLocaleString()} ₩
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {!!selectedMenuId && (
        <MenuDetailModal
          menuId={selectedMenuId}
          onClose={() => setSelectedMenuId(null)}
        />
      )}
    </div>
  );
}
