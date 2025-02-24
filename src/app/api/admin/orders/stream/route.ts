import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  console.log('뭐해?');

  writer.write(
    new TextEncoder().encode(
      'HTTP/1.1 200 OK\nContent-Type: text/event-stream\nCache-Control: no-cache\nConnection: keep-alive\n\n'
    )
  );

  // SSE에서 결제 완료(payments.status = 'success') 신호만 보냄
  const channel = supabase
    .channel('payments')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'payments' },
      async (payload) => {
        // console.log(payload);
        if (
          payload.eventType === 'UPDATE' &&
          payload.new.status === 'success'
        ) {
          writer.write(new TextEncoder().encode(`data: payment_success\n\n`));
        }
      }
    )
    .subscribe();

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
