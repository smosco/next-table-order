import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <h1>Next Table Order</h1>
      <Button>Order With Next Table Order</Button>
    </div>
  );
}
