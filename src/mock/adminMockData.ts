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
    image_url:
      'https://olo-images-live.imgix.net/52/52a8f582c62a414da6002349857386d3.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=536&h=536&fit=fill&fm=png32&bg=transparent&s=0a3dec41e72992aa5d698396f63887cc',
  },
  {
    id: 'e5f6g7h8-i9j0-1k2l-3m4n-o5p6a1b2c3d4',
    name: 'Steak & Cheese',
    description: 'Grilled steak with melted cheese on a toasted roll.',
    price: 10.99,
    categoryId: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6a1',
    image_url:
      'https://olo-images-live.imgix.net/52/52a8f582c62a414da6002349857386d3.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=536&h=536&fit=fill&fm=png32&bg=transparent&s=0a3dec41e72992aa5d698396f63887cc',
  },
  {
    id: 'f6g7h8i9-j0k1-2l3m-4n5o-p6a1b2c3d4e5',
    name: 'Lemonade',
    description: 'Freshly squeezed lemonade, served ice cold.',
    price: 2.99,
    categoryId: 'c3d4e5f6-g7h8-9i0j-1k2l-m3n4o5p6a1b2',
    image_url:
      'https://olo-images-live.imgix.net/52/52a8f582c62a414da6002349857386d3.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=536&h=536&fit=fill&fm=png32&bg=transparent&s=0a3dec41e72992aa5d698396f63887cc',
  },
];

export const orders: Order[] = [
  {
    id: 'o1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    tableId: 3,
    totalPrice: 19.97,
    status: 'pending',
    createdAt: '2025-01-25T14:30:00Z',
  },
  {
    id: 'o2b3c4d5-f6g7-8h9i-0j1k-l2m3n4o5p6a1',
    tableId: 1,
    totalPrice: 15.98,
    status: 'pending',
    createdAt: '2025-01-25T14:35:00Z',
  },
  {
    id: 'o3c4d5e6-g7h8-9i0j-1k2l-m3n4o5p6a1b2',
    tableId: 5,
    totalPrice: 25.98,
    status: 'pending',
    createdAt: '2025-01-25T14:40:00Z',
  },
];

export const orderItems: OrderItem[] = [
  // Order 1
  {
    id: 'oi1a2b3c4',
    orderId: 'o1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    menuItemId: 'd4e5f6g7-h8i9-0j1k-2l3m-n4o5p6a1b2c3',
    quantity: 2,
    price: 15.98,
  },
  {
    id: 'oi2b3c4d5',
    orderId: 'o1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    menuItemId: 'f6g7h8i9-j0k1-2l3m-4n5o-p6a1b2c3d4e5',
    quantity: 1,
    price: 3.99,
  },

  // Order 2
  {
    id: 'oi3c4d5e6',
    orderId: 'o2b3c4d5-f6g7-8h9i-0j1k-l2m3n4o5p6a1',
    menuItemId: 'd4e5f6g7-h8i9-0j1k-2l3m-n4o5p6a1b2c3',
    quantity: 1,
    price: 7.99,
  },
  {
    id: 'oi4d5e6f7',
    orderId: 'o2b3c4d5-f6g7-8h9i-0j1k-l2m3n4o5p6a1',
    menuItemId: 'e5f6g7h8-i9j0-1k2l-3m4n-o5p6a1b2c3d4',
    quantity: 1,
    price: 10.99,
  },

  // Order 3
  {
    id: 'oi5e6f7g8',
    orderId: 'o3c4d5e6-g7h8-9i0j-1k2l-m3n4o5p6a1b2',
    menuItemId: 'e5f6g7h8-i9j0-1k2l-3m4n-o5p6a1b2c3d4',
    quantity: 2,
    price: 21.98,
  },
  {
    id: 'oi6f7g8h9',
    orderId: 'o3c4d5e6-g7h8-9i0j-1k2l-m3n4o5p6a1b2',
    menuItemId: 'f6g7h8i9-j0k1-2l3m-4n5o-p6a1b2c3d4e5',
    quantity: 2,
    price: 5.98,
  },
];

export const payments: Payment[] = [
  {
    id: 'p1g2h3i4',
    orderId: 'o3c4d5e6-g7h8-9i0j-1k2l-m3n4o5p6a1b2',
    amount: 25.98,
    paymentMethod: 'card',
    status: 'success',
  },
];
