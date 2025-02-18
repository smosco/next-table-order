'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import MenuDetailModal from './MenuDetailModal';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { motion } from 'framer-motion';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
}

export function MenuGrid() {
  const { activeCategory, setActiveCategory } = useCategoryStore();
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
        setActiveCategory(currentCategory);
      }
    }, 200);
  }, [setActiveCategory]);

  useEffect(() => {
    if (!menuRef.current) return;
    const ref = menuRef.current;

    ref.addEventListener('scroll', handleScroll);
    return () => ref.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className='flex flex-col h-full'>
      <nav className='sticky top-0 z-10 bg-white shadow-sm'>
        <div className='flex overflow-x-auto py-4 px-6 space-x-4'>
          {Object.keys(groupedMenus).map((category) => (
            <button
              key={category}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-toss-blue text-white'
                  : 'bg-toss-gray-200 text-toss-gray-700 hover:bg-toss-gray-300'
              }`}
              onClick={() => {
                const element = document.getElementById(`category-${category}`);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>
      <div
        ref={menuRef}
        className='flex-1 overflow-y-auto px-6 py-8 space-y-12'
      >
        {loading ? (
          <SkeletonLoader />
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
                        <div className='flex justify-between items-center'>
                          <Badge
                            variant='secondary'
                            className='text-lg bg-toss-blue-light text-toss-blue'
                          >
                            {item.price.toLocaleString()} ₩
                          </Badge>
                        </div>
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

function SkeletonLoader() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(6)].map((_, index) => (
        <div key={index} className='animate-pulse'>
          <div className='bg-toss-gray-200 h-48 rounded-lg mb-4'></div>
          <div className='bg-toss-gray-200 h-6 w-3/4 rounded mb-2'></div>
          <div className='bg-toss-gray-200 h-4 w-1/2 rounded'></div>
        </div>
      ))}
    </div>
  );
}
