'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Category = {
  id: number;
  name: string;
  icon?: string;
  subCategories?: { id: number; name: string }[];
};

const categories: Category[] = [
  {
    id: 1,
    name: 'Sandwiches',
    subCategories: [
      { id: 11, name: 'Originals' },
      { id: 12, name: 'Favorites' },
      { id: 13, name: 'Giant Clubs' },
    ],
  },
  {
    id: 2,
    name: 'Sides',
    subCategories: [
      { id: 21, name: 'Chips' },
      { id: 22, name: 'Pickles' },
      { id: 23, name: 'Cookies' },
    ],
  },
  {
    id: 3,
    name: 'Drinks',
    subCategories: [
      { id: 31, name: 'Sodas' },
      { id: 32, name: 'Bottled Water' },
      { id: 33, name: 'Juices' },
    ],
  },
];

export function CategorySidebar({
  onCategorySelect,
}: {
  onCategorySelect: (id: number) => void;
}) {
  const [activeCategory, setActiveCategory] = React.useState<number | null>(
    null
  );

  const handleCategoryClick = (id: number) => {
    setActiveCategory(id);
    onCategorySelect(id);
  };

  return (
    <div className='w-64 border-r bg-card'>
      <div className='p-4 border-b'>
        <h2 className='font-semibold'>Menu Category</h2>
      </div>
      <nav className='p-2'>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant='ghost'
            className={cn(
              'w-full justify-start font-normal',
              activeCategory === category.id && 'bg-accent'
            )}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </nav>
    </div>
  );
}

export { categories };
