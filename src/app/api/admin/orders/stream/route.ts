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

  const sendOrders = async () => {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(
        `id, table_id, total_price, status, created_at,
        order_items(id, quantity, price, menus(name, image_url))`
      )
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) return;

    writer.write(
      new TextEncoder().encode(`data: ${JSON.stringify(orders)}\n\n`)
    );
  };

  const interval = setInterval(sendOrders, 5000);

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
