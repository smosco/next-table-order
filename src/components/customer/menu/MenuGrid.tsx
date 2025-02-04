'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
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

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
};

export function MenuGrid() {
  const { categoryId } = useParams(); // URL에서 categoryId 가져오기
  const [menuItems, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchMenus() {
      setLoading(true);
      try {
        const categoryParam = categoryId ? `?categoryId=${categoryId}` : '';
        const response = await fetch(`/api/public/menus${categoryParam}`);
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenus();
  }, [categoryId]);

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem({
        menuId: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        quantity,
        optionSelections: [], // 나중에 옵션 추가 가능하도록 빈 배열로 설정
      });

      // 초기화
      setSelectedItem(null);
      setQuantity(1);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
        {menuItems.map((item) => (
          <Card
            key={item.id}
            className='overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105'
            onClick={() => setSelectedItem(item)}
          >
            {/* TODO(@smosco): add image data */}
            <Image
              src='https://olo-images-live.imgix.net/28/288c61191b7c4deba30de5d6e7a62618.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=343&h=160&fit=fill&fm=png32&bg=transparent&s=2f0374c260416b3838b2c6e5dddf8d8f'
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

      <Dialog
        open={!!selectedItem}
        onOpenChange={() => {
          setSelectedItem(null);
          setQuantity(1);
        }}
      >
        <DialogContent className='sm:max-w-[425px]'>
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className='text-2xl font-bold'>
                  {selectedItem.name}
                </DialogTitle>
                <Image
                  src='https://olo-images-live.imgix.net/28/288c61191b7c4deba30de5d6e7a62618.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=343&h=160&fit=fill&fm=png32&bg=transparent&s=2f0374c260416b3838b2c6e5dddf8d8f'
                  alt={selectedItem.name}
                  width={343}
                  height={160}
                  className='w-full h-48 object-cover rounded-md mb-4'
                />
                <DialogDescription className='text-base'>
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className='flex items-center justify-between mt-6'>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className='w-4 h-4' />
                  </Button>
                  <span className='w-8 text-center text-lg font-semibold'>
                    {quantity}
                  </span>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className='w-4 h-4' />
                  </Button>
                </div>
                <Button onClick={handleAddToCart} className='text-lg px-6 py-2'>
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
