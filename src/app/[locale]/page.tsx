'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const t = useTranslations('HomePage');

  const handleAdminClick = () => {
    if (user) {
      router.push('/admin');
    } else {
      router.push('/admin/login');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 min-h-screen'>
      <h1>{t('title')}</h1>
      <div className='flex items-center gap-4'>
        <Button>
          <Link href='/customer/menu'>{t('customer')}</Link>
        </Button>
        <Button onClick={handleAdminClick} disabled={isLoading}>
          {t('admin')}
        </Button>
      </div>
    </div>
  );
}
