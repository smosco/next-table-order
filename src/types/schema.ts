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
  id?: string;
  name: string;
  description: string;
  price: number;
  category_id: string; // category_id → categoryId (통일 필요)
  image?: File | null; // 추가: 사용자가 업로드한 파일
  image_url?: string; // 기존의 URL
  options: OptionGroup[];
  status: 'hidden' | 'sold_out' | 'available';
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
