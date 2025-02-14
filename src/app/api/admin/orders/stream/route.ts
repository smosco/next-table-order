import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  writer.write(
    new TextEncoder().encode(
      'HTTP/1.1 200 OK\nContent-Type: text/event-stream\nCache-Control: no-cache\nConnection: keep-alive\n\n'
    )
  );

  // Supabase Realtime을 사용하여 주문 상태 변경 감지
  const channel = supabase
    .channel('orders')
    .on(
      'postgres_changes', // Postgres 변경 감지
      { event: '*', schema: 'public', table: 'orders' },
      async (payload) => {
        const { data: orders, error } = await supabase
          .from('orders')
          .select(
            `id, table_id, total_price, status, created_at,
            order_items(id, quantity, price, menus(name, image_url))`
          )
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) return;

        // 새로운 데이터가 감지되었을 때만 전송!
        writer.write(
          new TextEncoder().encode(`data: ${JSON.stringify(orders)}\n\n`)
        );
      }
    )
    .subscribe();

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
