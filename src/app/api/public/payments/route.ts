import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(req: Request) {
  let orderId: string | undefined;

  try {
    const body = await req.json();
    orderId = body.orderId; // orderId를 try 안에서 할당
    const paymentMethod = body.paymentMethod;

    console.log(orderId, '오더 아이디');

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      );
    }

    // 1. 현재 결제 요청(`pending`)이 있는지 확인
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('order_id', orderId)
      .eq('status', 'pending')
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'No pending payment found' },
        { status: 400 }
      );
    }

    // 2. 결제 성공 처리
    const { error: paymentUpdateError } = await supabase
      .from('payments')
      .update({
        status: 'paid',
        payment_method: paymentMethod,
      })
      .eq('id', payment.id);

    if (paymentUpdateError) {
      // 에러 발생하면 결제 실패 처리
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);

      return NextResponse.json(
        { error: 'Payment failed', reason: paymentUpdateError.message },
        { status: 500 }
      );
    }

    // 3. 주문의 결제 상태도 'paid'로 변경
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({ payment_status: 'paid' })
      .eq('id', orderId);

    if (orderUpdateError) throw orderUpdateError;

    return NextResponse.json(
      { message: 'Payment successful', paymentMethod },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Payment processing error:', error);

    if (orderId) {
      // orderId가 존재할 경우에만 실패 처리
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('order_id', orderId);
    }

    return NextResponse.json(
      {
        error: 'Payment processing failed',
        reason: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
