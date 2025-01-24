'use client';

import * as React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { useCart } from '@/app/CartProvider';
import { Minus, Plus } from 'lucide-react';

import { CategoryHeader } from './CategoryHeader';

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  options?: {
    name: string;
    choices: { id: number; name: string; price: number }[];
  }[];
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Turkey Tom',
    description:
      'Freshly sliced turkey breast, lettuce, tomato, and mayo on French bread.',
    price: 8500,
    image:
      'https://olo-images-live.imgix.net/92/92e4697b84cb427089283f558ee810d8.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=343&h=160&fit=fill&fm=png32&bg=transparent&s=5ce60b4b185ab0e568cfe0276a955f64',
    tags: ['CLASSIC'],
    options: [
      {
        name: 'Bread Choice',
        choices: [
          { id: 1, name: 'French Bread', price: 0 },
          { id: 2, name: 'Wheat Bread', price: 500 },
          { id: 3, name: 'Lettuce Wrap', price: 0 },
        ],
      },
      {
        name: 'Add-ons',
        choices: [
          { id: 1, name: 'Cheese', price: 1000 },
          { id: 2, name: 'Bacon', price: 1500 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Italian Night Club',
    description:
      'Salami, capicola, ham, provolone cheese, lettuce, tomato, onion, mayo, and Italian vinaigrette.',
    price: 9500,
    image:
      'https://olo-images-live.imgix.net/31/3175f91c80a643a38815bd0332c341cd.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=343&h=160&fit=fill&fm=png32&bg=transparent&s=5cd7f148d3d92a9d33006bd65be420eb',
    tags: ['BEST SELLER'],
    options: [
      {
        name: 'Bread Choice',
        choices: [
          { id: 1, name: 'French Bread', price: 0 },
          { id: 2, name: 'Wheat Bread', price: 500 },
          { id: 3, name: 'Lettuce Wrap', price: 0 },
        ],
      },
      {
        name: 'Add-ons',
        choices: [
          { id: 1, name: 'Cheese', price: 1000 },
          { id: 2, name: 'Hot Peppers', price: 500 },
          { id: 3, name: 'Avocado Spread', price: 1500 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Beach Club',
    description:
      'Turkey breast, avocado spread, provolone cheese, lettuce, tomato, cucumber, and mayo.',
    price: 10000,
    image:
      'https://olo-images-live.imgix.net/58/587e632c6b31436397d67524f6db2866.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=343&h=160&fit=fill&fm=png32&bg=transparent&s=429130c3612334a5a7c50569b11aac4f',
    tags: ['FRESH'],
    options: [
      {
        name: 'Bread Choice',
        choices: [
          { id: 1, name: 'French Bread', price: 0 },
          { id: 2, name: 'Wheat Bread', price: 500 },
          { id: 3, name: 'Lettuce Wrap', price: 0 },
        ],
      },
      {
        name: 'Add-ons',
        choices: [
          { id: 1, name: 'Cheese', price: 1000 },
          { id: 2, name: 'Avocado Spread', price: 1500 },
          { id: 3, name: 'Extra Turkey', price: 2000 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Club Lulu',
    description: 'Turkey breast, crispy bacon, lettuce, tomato, and mayo.',
    price: 10500,
    image:
      'https://olo-images-live.imgix.net/42/42f55e97c16f4d809562688f9889434d.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=343&h=160&fit=fill&fm=png32&bg=transparent&s=568e1d019c2dad4d64381ea898404993',
    tags: ['CLASSIC'],
    options: [
      {
        name: 'Bread Choice',
        choices: [
          { id: 1, name: 'French Bread', price: 0 },
          { id: 2, name: 'Wheat Bread', price: 500 },
          { id: 3, name: 'Lettuce Wrap', price: 0 },
        ],
      },
      {
        name: 'Add-ons',
        choices: [
          { id: 1, name: 'Cheese', price: 1000 },
          { id: 2, name: 'Extra Bacon', price: 1500 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Big John',
    description:
      'Medium rare roast beef, lettuce, tomato, and mayo on French bread.',
    price: 9500,
    image:
      'https://olo-images-live.imgix.net/5f/5ff5a584ae3542d38a2ede7dd1a7ddfd.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=343&h=160&fit=fill&fm=png32&bg=transparent&s=5b87f521eadc5b7bc8caeb35327d0e46',
    tags: ['CLASSIC'],
    options: [
      {
        name: 'Bread Choice',
        choices: [
          { id: 1, name: 'French Bread', price: 0 },
          { id: 2, name: 'Wheat Bread', price: 500 },
          { id: 3, name: 'Lettuce Wrap', price: 0 },
        ],
      },
      {
        name: 'Add-ons',
        choices: [
          { id: 1, name: 'Cheese', price: 1000 },
          { id: 2, name: 'Avocado Spread', price: 1500 },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'The Veggie',
    description:
      'Provolone cheese, avocado spread, cucumber, lettuce, tomato, and mayo.',
    price: 9000,
    image:
      'https://olo-images-live.imgix.net/0d/0d929ae650cc4e2c8d6fd6d37af80af8.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=343&h=160&fit=fill&fm=png32&bg=transparent&s=254bf6a0681849104e6b82a4a6965de2',
    tags: ['VEGETARIAN'],
    options: [
      {
        name: 'Bread Choice',
        choices: [
          { id: 1, name: 'French Bread', price: 0 },
          { id: 2, name: 'Wheat Bread', price: 500 },
          { id: 3, name: 'Lettuce Wrap', price: 0 },
        ],
      },
      {
        name: 'Add-ons',
        choices: [
          { id: 1, name: 'Extra Cheese', price: 1500 },
          { id: 2, name: 'Hot Peppers', price: 500 },
          { id: 3, name: 'Avocado Spread', price: 1500 },
        ],
      },
    ],
  },
];

export function MenuGrid({
  activeCategoryId,
}: {
  activeCategoryId: number | null;
}) {
  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const { addItem } = useCart();
  const [subCategoryId, setSubCategoryId] = React.useState<number | null>(null);

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem({
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        quantity,
      });
      setSelectedItem(null);
      setQuantity(1);
    }
  };

  return (
    <>
      <CategoryHeader
        categoryId={activeCategoryId}
        subCategoryId={subCategoryId}
        onSubCategorySelect={setSubCategoryId}
      />
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
        {menuItems.map((item) => (
          <Card
            key={item.id}
            className='overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]'
            onClick={() => setSelectedItem(item)}
          >
            <div className='relative aspect-[4/3]'>
              <Image
                src={item.image}
                alt={item.name}
                fill
                className='object-cover'
              />
              {item.tags?.map((tag) => (
                <Badge
                  key={tag}
                  className='absolute top-2 left-2'
                  variant={tag === 'NEW' ? 'destructive' : 'default'}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <CardContent className='p-4'>
              <h3 className='font-semibold mb-1'>{item.name}</h3>
              <p className='text-sm text-muted-foreground mb-2'>
                {item.description}
              </p>
              <p className='font-medium'>{item.price.toLocaleString()} ₩</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className='sm:max-w-[425px]'>
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className='relative aspect-video mb-4'>
                <Image
                  src={selectedItem.image || '/placeholder.svg'}
                  alt={selectedItem.name}
                  fill
                  className='object-cover rounded-md'
                />
              </div>

              {selectedItem.options?.map((option) => (
                <div key={option.name} className='mb-4'>
                  <h4 className='font-medium mb-2'>{option.name}</h4>
                  <div className='grid gap-2'>
                    {option.choices.map((choice) => (
                      <div
                        key={choice.id}
                        className='flex items-center justify-between p-2 rounded border'
                      >
                        <span>{choice.name}</span>
                        {choice.price > 0 && (
                          <span className='text-sm text-muted-foreground'>
                            +{choice.price.toLocaleString()} ₩
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className='flex items-center justify-between mt-4'>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className='w-4 h-4' />
                  </Button>
                  <span className='w-8 text-center'>{quantity}</span>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className='w-4 h-4' />
                  </Button>
                </div>
                <Button onClick={handleAddToCart}>
                  Add to Order{' '}
                  {(selectedItem.price * quantity).toLocaleString()} ₩
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
