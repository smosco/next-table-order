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

    // 1. 주문 생성
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
    const orderId = orderData.id;

    // 2️. `order_items`에 데이터 저장
    const orderItemsData = items.map((item: any) => ({
      order_id: orderId,
      menu_id: item.menuId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (orderItemsError) throw orderItemsError;

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
