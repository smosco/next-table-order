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

    // 1. 현재 열린 `order_group`이 있는지 확인
    let { data: existingGroup } = await supabase
      .from('order_groups')
      .select('id')
      .eq('table_id', tableId)
      .is('closed_at', null)
      .single();

    // 2. 없으면 새로 생성
    if (!existingGroup) {
      const { data: newGroup, error: groupError } = await supabase
        .from('order_groups')
        .insert([{ table_id: tableId }])
        .select('id')
        .single();
      if (groupError) throw groupError;
      existingGroup = newGroup;
    }

    const orderGroupId = existingGroup.id;

    // 3. 주문 생성 (`order_group_id` 포함)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          table_id: tableId,
          total_price: totalPrice,
          status: 'pending',
          order_group_id: orderGroupId,
        },
      ])
      .select('id')
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // 4️. 주문 항목 추가
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

    return NextResponse.json({ orderId, orderGroupId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tableId = searchParams.get('tableId');

    if (!tableId) {
      return NextResponse.json(
        { error: 'Table ID is required' },
        { status: 400 }
      );
    }

    // 현재 열린 order_group 찾기
    const { data: orderGroup } = await supabase
      .from('order_groups')
      .select('id')
      .eq('table_id', tableId)
      .is('closed_at', null)
      .single();

    if (!orderGroup) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    // 현재 order_group에 속한 주문들 조회
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('order_group_id', orderGroup.id);

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
