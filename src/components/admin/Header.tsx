'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function AdminHeader() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <header className='lg:ml-[170px] h-16 flex justify-between items-center px-6 bg-white border-b border-toss-gray-200 shadow-sm fixed top-0 left-0 right-0'>
      {isLoading ? (
        <p>Loading...</p>
      ) : isLoggedIn ? (
        <div className='flex items-center gap-4'>
          <span className='text-gray-700'>{user?.email}</span>
          <button
            onClick={handleLogout}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => router.push('/admin/login')}
          className='bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition'
        >
          Login
        </button>
      )}
    </header>
  );
}
