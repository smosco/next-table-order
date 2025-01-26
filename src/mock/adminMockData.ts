import type {
  Restaurant,
  Table,
  Category,
  MenuItem,
  Order,
  OrderItem,
  Payment,
} from '@/types/schema';

export const restaurant: Restaurant = {
  id: '1b2b3b4b-5c6c-7d8d-9e0e-1f2f3f4f5f6f',
  name: "Jimmy Johnson's Sandwich Shop",
  address: '456 Sandwich Street, Flavor Town, FT 67890',
  ownerName: 'Jimmy Johnson',
  phone: '02-987-6543',
};

export const tables: Table[] = [
  { id: 1, name: 'Table A', capacity: 4 },
  { id: 2, name: 'Table B', capacity: 2 },
  { id: 3, name: 'Table C', capacity: 6 },
  { id: 4, name: 'Table D', capacity: 4 },
];

export const categories: Category[] = [
  { id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', name: 'Classic Sandwiches' },
  { id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6a1', name: 'Premium Sandwiches' },
  { id: 'c3d4e5f6-g7h8-9i0j-1k2l-m3n4o5p6a1b2', name: 'Beverages' },
];

export const menuItems: MenuItem[] = [
  {
    id: 'd4e5f6g7-h8i9-0j1k-2l3m-n4o5p6a1b2c3',
    name: 'Turkey Club',
    description: 'A classic turkey sandwich with lettuce, tomato, and mayo.',
    price: 7.99,
    categoryId: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  },
  {
    id: 'e5f6g7h8-i9j0-1k2l-3m4n-o5p6a1b2c3d4',
    name: 'Steak & Cheese',
    description: 'Grilled steak with melted cheese on a toasted roll.',
    price: 10.99,
    categoryId: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6a1',
  },
  {
    id: 'f6g7h8i9-j0k1-2l3m-4n5o-p6a1b2c3d4e5',
    name: 'Lemonade',
    description: 'Freshly squeezed lemonade, served ice cold.',
    price: 2.99,
    categoryId: 'c3d4e5f6-g7h8-9i0j-1k2l-m3n4o5p6a1b2',
  },
];

export const orders: Order[] = [
  {
    id: 'g7h8i9j0-k1l2-3m4n-5o6p-a1b2c3d4e5f6',
    tableId: 1,
    totalPrice: 18.98,
    status: 'pending',
    createdAt: '2025-01-25T14:30:00Z',
  },
  {
    id: 'h8i9j0k1-l2m3-4n5o-6p7a-b2c3d4e5f6g7',
    tableId: 2,
    totalPrice: 10.99,
    status: 'completed',
    createdAt: '2025-01-25T15:00:00Z',
  },
];

export const orderItems: OrderItem[] = [
  {
    id: 'i9j0k1l2-m3n4-5o6p-7a8b-c3d4e5f6g7h8',
    orderId: 'g7h8i9j0-k1l2-3m4n-5o6p-a1b2c3d4e5f6',
    menuItemId: 'd4e5f6g7-h8i9-0j1k-2l3m-n4o5p6a1b2c3',
    quantity: 2,
    price: 7.99,
  },
  {
    id: 'j0k1l2m3-n4o5-6p7a-8b9c-d4e5f6g7h8i9',
    orderId: 'h8i9j0k1-l2m3-4n5o-6p7a-b2c3d4e5f6g7',
    menuItemId: 'e5f6g7h8-i9j0-1k2l-3m4n-o5p6a1b2c3d4',
    quantity: 1,
    price: 10.99,
  },
];

export const payments: Payment[] = [
  {
    id: 'k1l2m3n4-o5p6-7a8b-9c0d-e5f6g7h8i9j0',
    orderId: 'h8i9j0k1-l2m3-4n5o-6p7a-b2c3d4e5f6g7',
    amount: 10.99,
    paymentMethod: 'card',
    status: 'success',
  },
];
