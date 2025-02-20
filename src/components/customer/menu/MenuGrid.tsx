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
  category_name: string;
  image_url: string;
  option_groups: OptionGroup[];
  status: 'hidden' | 'sold_out' | 'available';
}

export function MenuGrid() {
  const { activeCategory, setActiveCategory } = useCategoryStore();
  const queryClient = useQueryClient();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['menus'],
    queryFn: async () => {
      const response = await fetch('/api/public/menus');
      return response.json();
    },
  });

  useEffect(() => {
    if (menuItems.length > 0) {
      menuItems.forEach((menu: MenuItem) => {
        queryClient.setQueryData(['menu', menu.id], menu);
      });
    }
  }, [menuItems, queryClient]);

  const groupedMenus = useMemo(() => {
    return menuItems.reduce<
      Record<string, { name: string; items: MenuItem[] }>
    >((acc, item) => {
      if (!acc[item.category_id]) {
        acc[item.category_id] = { name: item.category_name || '', items: [] };
      }
      acc[item.category_id].items.push(item);
      return acc;
    }, {});
  }, [menuItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleCategory = entries.find((entry) => entry.isIntersecting);
        if (visibleCategory) {
          setActiveCategory(visibleCategory.target.id.replace('category-', ''));
        }
      },
      { root: menuRef.current, threshold: 0.1 }
    );

    Object.values(categoryRefs.current).forEach((category) => {
      if (category) observer.observe(category);
    });

    return () => observer.disconnect();
  }, [groupedMenus, setActiveCategory]);

  return (
    <div className='flex flex-col h-full'>
      <div
        ref={menuRef}
        className='flex-1 overflow-y-auto px-6 py-8 space-y-12'
      >
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          Object.entries(groupedMenus).map(([categoryId, { name, items }]) => (
            <div
              key={categoryId}
              id={`category-${categoryId}`}
              ref={(el) => {
                categoryRefs.current[categoryId] = el;
              }}
              className='pb-10 border-b-2 border-gray-200'
            >
              <h2 className='text-2xl font-bold mb-6 text-toss-gray-900'>
                {name}
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
                      className={`overflow-hidden cursor-pointer transition-all duration-300 ${
                        item.status === 'sold_out'
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-lg hover:scale-105'
                      }`}
                      onClick={() =>
                        item.status !== 'sold_out' && setSelectedMenuId(item.id)
                      }
                    >
                      <div className='relative'>
                        <Image
                          src={item.image_url || '/placeholder.png'}
                          alt={item.name}
                          width={343}
                          height={200}
                          className='w-full h-48 object-cover'
                        />
                        {item.status === 'sold_out' && (
                          <div className='absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded'>
                            sold_out
                          </div>
                        )}
                      </div>
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
