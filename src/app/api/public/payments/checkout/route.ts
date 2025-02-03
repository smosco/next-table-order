import { NextResponse } from 'next/server';
import { createClient, PostgrestError } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { tableId, items, totalPrice, paymentMethod } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payment data' },
        { status: 400 }
      );
    }

    // 1. 결제 정보 저장
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          amount: totalPrice,
          payment_method: paymentMethod,
          status: 'success',
        },
      ])
      .select('id')
      .single();

    if (paymentError) throw paymentError;

    // 2. 주문 생성
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        { table_id: tableId, total_price: totalPrice, status: 'completed' },
      ])
      .select('id')
      .single();

    if (orderError) throw orderError;

    // 3. 주문 아이템 저장
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      menu_id: item.menuId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemError } = await supabase
      .from('order_items')
      .insert(orderItems);
    if (itemError) throw itemError;

    return NextResponse.json(
      { orderId: orderData.id, message: 'Payment & Order Success' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Payment error:', error);

    let errorMessage = 'Unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if ((error as PostgrestError)?.message) {
      errorMessage = (error as PostgrestError).message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
