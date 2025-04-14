'use client';

import { createContext, useContext, useState } from 'react';

type CartItem = {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  options: { optionId: string; optionName: string; price: number }[];
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      // 같은 menuId라도 옵션 조합이 다르면 다른 아이템으로 추가
      const newItemKey = `${newItem.menuId}-${newItem.options
        ?.map((opt) => opt.optionId)
        .join('-')}`;

      const existingIndex = prev.findIndex(
        (i) =>
          i.menuId === newItem.menuId &&
          i.options?.map((opt) => opt.optionId).join('-') ===
            newItem.options?.map((opt) => opt.optionId).join('-')
      );

      if (existingIndex !== -1) {
        // 기존 아이템이 있으면 수량 증가
        const updatedItems = [...prev];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + newItem.quantity,
        };
        return updatedItems;
      }

      // 새로운 아이템 추가
      return [...prev, newItem];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.menuId !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.menuId === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // 옵션 가격을 총 가격에 포함
  const total = items.reduce((sum, item) => {
    const optionsTotal =
      item.options?.reduce((acc, opt) => acc + opt.price, 0) ?? 0;

    return sum + (item.price + optionsTotal) * item.quantity;
  }, 0);

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

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
