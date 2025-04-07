'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function AdminLoginPage() {
  const t = useTranslations('AdminLoginPage');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // 로그인 성공하면 /admin으로 이동
    router.push('/admin');
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>{t('title')}</h1>
      <form onSubmit={handleLogin} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='border p-2 rounded'
          required
        />
        <input
          type='password'
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='border p-2 rounded'
          required
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          {t('submit')}
        </button>
      </form>
      {error && <p className='text-red-500 mt-2'>{error}</p>}
    </div>
  );
}
