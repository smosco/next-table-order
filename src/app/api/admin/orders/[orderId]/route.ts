// ✅ 특정 주문 ID를 기반으로 해당 주문 데이터만 가져오는 API
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const { data: order, error } = await supabase
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
    .eq('id', orderId)
    .single(); // 특정 주문 하나만 가져옴

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(order), {
    headers: { 'Content-Type': 'application/json' },
  });
}
