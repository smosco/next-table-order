import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(req: Request) {
  try {
    const { orderId, paymentMethod } = await req.json();

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      );
    }

    // 1️. 결제 상태 변경 (pending → success) + 결제 방법 업데이트
    const { error: paymentUpdateError } = await supabase
      .from('payments')
      .update({
        status: 'success',
        payment_method: paymentMethod,
      })
      .eq('order_id', orderId)
      .eq('status', 'pending');

    if (paymentUpdateError) throw paymentUpdateError;

    return NextResponse.json(
      { message: 'Payment confirmed', paymentMethod },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
