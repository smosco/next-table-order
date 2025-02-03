import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <h1>Next Table Order</h1>
      <div className='flex items-center gap-4'>
        <Button>
          <Link href='/customer/menu'>Customer</Link>
        </Button>
        <Button>
          <Link href='/admin'>Admin</Link>
        </Button>
      </div>
    </div>
  );
}
