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

  // SSE에서 **주문이 추가되었다는 신호만 보냄**
  const channel = supabase
    .channel('orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      async (payload) => {
        // 변화가 발생했다는 신호만 전송 (데이터 없음)
        writer.write(new TextEncoder().encode(`data: update\n\n`));
      }
    )
    .subscribe();

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
