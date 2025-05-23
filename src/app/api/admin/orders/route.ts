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
      `
      id, table_id, total_price, status, payment_status, created_at,
      order_items(
        id, quantity, price,
        menus(name, image_url),
        order_item_options(
          option_id, option_price,
          options(name)
        )
      )
    `
    )
    .eq('payment_status', 'paid') // 결제 완료된 주문만 불러오기
    .in('status', ['pending', 'preparing', 'ready']) // 서빙된 주문 제외
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(orders), {
    headers: { 'Content-Type': 'application/json' },
  });
}
