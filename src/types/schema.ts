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

export interface Option {
  id: UUID;
  name: string;
  price: number;
}

export interface OptionGroup {
  id: UUID;
  name: string;
  is_required: boolean;
  max_select: number;
  options: Option[]; // 옵션 그룹 내 옵션 리스트
}

export interface MenuItem {
  // TODO(@smosco): 타입 문제 잠깐 우회
  option_groups: never[];
  id: UUID;
  name: string;
  description: string;
  price: number;
  categoryId: UUID;
  image_url: string;
  options?: OptionGroup[];
}

export interface Order {
  id: UUID;
  tableId: number;
  totalPrice: number;
  status: 'pending' | 'preparing' | 'completed';
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
