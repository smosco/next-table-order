'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MenuIcon } from 'lucide-react';

type Category = {
  id: string;
  name: string;
};

export function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const activeCategoryId = pathname.split('/').pop();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/public/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className='w-64 border-r border-border h-full'>
      <div className='p-6 border-b border-border'>
        <h2 className='text-2xl font-bold text-primary flex items-center'>
          <MenuIcon className='mr-2 h-6 w-6' />
          Menu
        </h2>
      </div>
      <ScrollArea className='h-[calc(100vh-5rem)]'>
        <nav className='p-4'>
          <Link href='/customer/menu' passHref>
            <Button
              variant='ghost'
              className={cn(
                'w-full justify-start text-lg py-6 mb-2 hover:bg-accent/50 transition-colors',
                activeCategoryId === 'menu' &&
                  'bg-accent text-accent-foreground font-semibold'
              )}
            >
              All Categories
            </Button>
          </Link>
          <Separator className='my-4' />
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/customer/menu/${category.id}`}
              passHref
            >
              <Button
                variant='ghost'
                className={cn(
                  'w-full justify-start text-lg py-6 mb-2 hover:bg-accent/50 transition-colors',
                  activeCategoryId === category.id &&
                    'bg-accent text-accent-foreground font-semibold'
                )}
              >
                {category.name}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
