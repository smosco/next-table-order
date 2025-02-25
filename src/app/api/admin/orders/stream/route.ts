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
    .channel('orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      async (payload) => {
        console.log('🔔 주문 상태 변경 감지:', payload);
        // TODO(@smosco): 필요하다면 이벤트에 따라 다른 data를 넘겨서 여러 개의 트리거를 만들 수 있음
        writer.write(new TextEncoder().encode(`data: order_updated\n\n`));
      }
    )
    .subscribe();

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
