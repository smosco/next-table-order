import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { tableId, items, totalPrice } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      );
    }

    // 주문 생성 (payment_id는 NULL)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          table_id: tableId,
          total_price: totalPrice,
          status: 'pending',
          payment_id: null,
        },
      ])
      .select('id')
      .single();

    if (orderError) throw orderError;

    return NextResponse.json({ orderId: orderData.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
