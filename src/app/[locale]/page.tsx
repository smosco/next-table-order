'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function Home() {
  const router = useRouter();
  const t = useTranslations('HomePage');

  const handleAdminClick = () => {
    router.push('/admin');
  };

  return (
    <div className='flex flex-col items-center justify-center gap-8 min-h-screen p-8'>
      <h1 className='text-4xl font-bold text-toss-gray-900 mb-4'>
        {t('title')}
      </h1>
      <div className='flex items-center gap-6'>
        <Button className='text-xl py-6 px-8 rounded-xl h-auto'>
          <Link href='/customer/menu'>{t('customer')}</Link>
        </Button>
        <Button
          onClick={handleAdminClick}
          className='text-xl py-6 px-8 rounded-xl h-auto'
        >
          {t('admin')}
        </Button>
      </div>
    </div>
  );
}
