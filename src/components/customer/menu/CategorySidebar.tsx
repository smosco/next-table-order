'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Category = {
  id: string;
  name: string;
};

export function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const activeCategoryId = pathname.split('/').pop(); // ✅ 현재 URL에서 ID 가져오기

  // Supabase에서 카테고리 목록 가져오기
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/public/categories'); // ✅ 카테고리 목록 API 호출
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className='w-64 border-r bg-card'>
      <div className='p-4 border-b'>
        <h2 className='font-semibold'>Menu Category</h2>
      </div>
      <nav className='p-2'>
        {/* 전체 메뉴 보기 (카테고리 없음) */}
        <Link href='/customer/menu' passHref>
          <Button
            variant='ghost'
            className={cn(
              'w-full justify-start font-normal',
              activeCategoryId === 'menu' && 'bg-accent' // 현재 `/customer/menu`이면 활성화
            )}
          >
            All Categories
          </Button>
        </Link>

        {/* ID 기반으로 카테고리 링크 이동 */}
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/customer/menu/${category.id}`} // ID를 기반으로 링크 생성
            passHref
          >
            <Button
              variant='ghost'
              className={cn(
                'w-full justify-start font-normal',
                activeCategoryId === category.id && 'bg-accent' // URL ID와 현재 ID 비교하여 활성화
              )}
            >
              {category.name}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
