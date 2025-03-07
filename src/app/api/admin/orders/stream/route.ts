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

  const channel = supabase
    .channel('order_events')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'order_events' },
      async (payload) => {
        console.log('🔔 새로운 주문 이벤트 발생:', payload.new);

        const eventType = payload.new.event_type;
        const orderId = payload.new.order_id;

        // ✅ 변경된 주문 ID를 SSE로 전송
        writer.write(
          new TextEncoder().encode(`data: ${eventType}:${orderId}\n\n`)
        );
      }
    )
    .subscribe();

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
