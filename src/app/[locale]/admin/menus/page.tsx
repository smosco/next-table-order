'use client';

import { useState } from 'react';
import MenuList from '@/components/admin/menu/MenuList';
import MenuFormModal from '@/components/admin/menu/MenuFormModal'; // 주석 해제
import type { MenuItem } from '@/types/schema';
import { Button } from '@/components/ui/button';

export default function MenuPage() {
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  const handleAddMenu = () => {
    setEditingMenu(null);
    setShowMenuModal(true);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>상품 관리</h2>
        <div className='flex gap-2'>
          {/* 카테고리/옵션 모달은 이후 연결 */}
          <Button onClick={handleAddMenu}>상품 추가</Button>
        </div>
      </div>

      <MenuList
        onEditMenu={(menu) => {
          setEditingMenu(menu);
          setShowMenuModal(true);
        }}
      />

      <MenuFormModal
        open={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        menuToEdit={editingMenu}
        onMenuUpdated={() => {
          setShowMenuModal(false);
          // 메뉴 리스트 갱신 로직은 MenuList 내부에서 처리되거나 부모에서 상태로 연결 가능
        }}
      />
    </div>
  );
}
