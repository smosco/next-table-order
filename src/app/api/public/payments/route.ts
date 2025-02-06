import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { orderId, paymentMethod } = await req.json();

    // 1️. 주문 정보 확인
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('id, total_price')
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2️. 결제 정보 저장
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
    const paymentId = paymentData.id;

    // 3️. 주문 상태 업데이트
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ status: 'completed', payment_id: paymentId })
      .eq('id', orderId);

    if (updateOrderError) throw updateOrderError;

    // 4️. `order_items`을 가져와서 `sales` 테이블에 저장
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('menu_id, quantity, price')
      .eq('order_id', orderId);

    if (orderItemsError || !orderItems) {
      return NextResponse.json(
        { error: 'Order items not found' },
        { status: 404 }
      );
    }

    const salesData = orderItems.map((item: any) => ({
      order_id: orderId,
      menu_id: item.menu_id,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
      created_at: new Date().toISOString(),
    }));

    const { error: salesError } = await supabase
      .from('sales')
      .insert(salesData);

    if (salesError) throw salesError;

    return NextResponse.json(
      { message: 'Payment successful and sales recorded', paymentId },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
