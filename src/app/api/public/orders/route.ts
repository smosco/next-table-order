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

    // 1️. 현재 열린 order_group 찾기
    const { data: orderGroup, error: groupError } = await supabase
      .from('order_groups')
      .select('id')
      .eq('table_id', tableId)
      .is('closed_at', null)
      .single();

    if (groupError || !orderGroup) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    // 2️. 현재 order_group에 속한 주문들 조회
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, created_at, total_price')
      .eq('order_group_id', orderGroup.id);

    if (ordersError || !orders.length) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    // 3️. 주문 내역 조회 (order_items + menu_items 조인)
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select(
        `
    order_id,
    quantity,
    price,
    menu_id,
    menus(name, price)
  `
      )
      .in(
        'order_id',
        orders.map((order) => order.id)
      );

    if (orderItemsError) {
      throw orderItemsError;
    }

    console.log('Order Items:', orderItems);

    // 4️. orders 배열에 order_items 추가하여 응답 데이터 구성
    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: orderItems
        .filter((item) => item.order_id === order.id)
        .map((item) => {
          const menu = item.menus as unknown as { name: string; price: number }; // TypeScript가 단일 객체로 인식하도록 명시
          return {
            name: menu.name || 'Unknown',
            quantity: item.quantity,
            price: item.price,
          };
        }),
    }));

    return NextResponse.json({ orders: ordersWithItems }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
