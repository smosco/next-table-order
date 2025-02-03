'use client';

import { createContext, useContext, useState } from 'react';

type CartItem = {
  menuId: string; // Supabase `menus.id`와 매칭
  name: string;
  price: number;
  quantity: number;
  optionSelections?: { optionId: string; choiceId: string }[]; // 선택된 옵션 추가
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void; // 결제 후 카트 비우기 기능 추가
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 장바구니에 아이템 추가
  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuId === item.menuId);
      if (existing) {
        return prev.map((i) =>
          i.menuId === item.menuId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  // 장바구니에서 아이템 제거
  const removeItem = (menuId: string) => {
    setItems((prev) => prev.filter((item) => item.menuId !== menuId));
  };

  // 수량 업데이트
  const updateQuantity = (menuId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.menuId === menuId ? { ...item, quantity } : item
      )
    );
  };

  // 결제 후 장바구니 비우기
  const clearCart = () => {
    setItems([]);
  };

  // 총 가격 계산
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 카트 컨텍스트 사용 훅
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
