'use client';

import MenuForm from '@/components/admin/menu/MenuForm';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditMenuPage() {
  const router = useRouter();
  const { id } = useParams();
  console.log(id);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    async function fetchMenu() {
      const res = await fetch(`/api/public/menus/${id}`);
      const data = await res.json();
      setMenu(data);
    }
    fetchMenu();
  }, [id]);

  const handleMenuUpdated = () => {
    router.push('/admin/menus');
  };

  return menu ? (
    <MenuForm menuToEdit={menu} onMenuUpdated={handleMenuUpdated} />
  ) : (
    <p>Loading...</p>
  );
}
