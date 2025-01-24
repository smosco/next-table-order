'use client';

import { useCart } from '@/app/CartProvider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShoppingCart } from 'lucide-react';

export function BottomBar() {
  const { total, setIsCartOpen } = useCart();

  return (
    <div className='sticky bottom-0 border-t bg-background p-4'>
      <div className='flex items-center justify-between gap-4'>
        <Select defaultValue='ko'>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Language' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ko'>한국어</SelectItem>
            <SelectItem value='en'>English</SelectItem>
            <SelectItem value='ja'>日本語</SelectItem>
            <SelectItem value='zh'>中文</SelectItem>
          </SelectContent>
        </Select>

        <Button
          size='lg'
          className='flex-1'
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className='mr-2 h-5 w-5' />
          {total > 0 ? `Order Now ${total.toLocaleString()} ₩` : 'View Cart'}
        </Button>
      </div>
    </div>
  );
}
