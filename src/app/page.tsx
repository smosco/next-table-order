'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleAdminClick = () => {
    if (user) {
      router.push('/admin');
    } else {
      router.push('/admin/login');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 min-h-screen'>
      <h1>Next Table Order</h1>
      <div className='flex items-center gap-4'>
        <Button>
          <Link href='/customer/menu'>Customer</Link>
        </Button>
        <Button onClick={handleAdminClick} disabled={isLoading}>
          Admin
        </Button>
      </div>
    </div>
  );
}
