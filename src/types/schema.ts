export type UUID = string;

export interface Restaurant {
  id: UUID;
  name: string;
  address: string;
  ownerName: string;
  phone: string;
}

export interface Table {
  id: number;
  name: string;
  capacity: number;
}

export interface Category {
  id: UUID;
  name: string;
}

export interface MenuItem {
  id: UUID;
  name: string;
  description: string;
  price: number;
  categoryId: UUID;
}

export interface Order {
  id: UUID;
  tableId: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'canceled';
  createdAt: string;
}

export interface OrderItem {
  id: UUID;
  orderId: UUID;
  menuItemId: UUID;
  quantity: number;
  price: number;
}

export interface Payment {
  id: UUID;
  orderId: UUID;
  amount: number;
  paymentMethod: 'card' | 'cash' | 'transfer';
  status: 'success' | 'failed' | 'pending';
}
