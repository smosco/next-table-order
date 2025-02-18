import { useQuery } from '@tanstack/react-query';
import { Order } from '@/types/columns';

const fetchOrders = async (): Promise<{ orders: Order[] }> => {
  const res = await fetch(`/api/admin/orders/analytics`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export default function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
}
