import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderId, paymentMethod } = await req.json();

    // 주문 존재 여부 확인
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('id, total_price')
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 결제 정보 저장
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          order_id: orderId,
          amount: orderData.total_price,
          payment_method: paymentMethod,
          status: 'success',
        },
      ])
      .select('id')
      .single();

    if (paymentError) throw paymentError;

    // 주문에 결제 정보 업데이트
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ status: 'completed', payment_id: paymentData.id })
      .eq('id', orderId);

    if (updateOrderError) throw updateOrderError;

    return NextResponse.json(
      { message: 'Payment successful', paymentId: paymentData.id },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
