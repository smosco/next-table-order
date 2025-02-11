'use client';

import { useEffect, useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CategorySidebar() {
  const { data: categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveCategory(hash);
        scrollToCategory(hash);
      }
    }
  }, []);

  const scrollToCategory = (categoryName: string) => {
    const element = document.getElementById(`category-${categoryName}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    router.replace(`${pathname}#${categoryName}`, { scroll: false }); // URL 업데이트
    scrollToCategory(categoryName); // 해당 카테고리로 스크롤 이동
  };

  return (
    <div className='w-64 border-r h-full'>
      <ScrollArea className='h-full'>
        <nav className='p-4'>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant='ghost'
              className={cn(
                'w-full text-lg py-4 mb-2 hover:bg-accent/50',
                activeCategory === category.id &&
                  'bg-accent text-accent-foreground font-semibold'
              )}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
