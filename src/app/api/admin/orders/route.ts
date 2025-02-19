import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(
      `id, table_id, total_price, status, created_at,
      order_items(id, quantity, price, menus(name, image_url))`
    )
    .in('status', ['pending', 'preparing', 'ready']) // 서빙된 주문 제외
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(orders), {
    headers: { 'Content-Type': 'application/json' },
  });
}
