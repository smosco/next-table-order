import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type OrderItem = {
  order_id: string;
  quantity: number;
  price: number;
  menu_id: string;
  menus: { name: string }; // 단일 객체로 확실하게 정의
};

export async function GET() {
  try {
    // 1️.현재 활성화된 주문 그룹 조회 (closed_at이 NULL인 order_groups)
    const { data: activeOrderGroups, error: groupError } = await supabase
      .from('order_groups')
      .select('id, table_id')
      .is('closed_at', null);

    if (groupError || !activeOrderGroups.length) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    const activeOrderGroupIds = activeOrderGroups.map((group) => group.id);

    // 2️.현재 활성화된 주문들 가져오기 (order_group_id 기준으로 묶기)
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_group_id, table_id, total_price, created_at')
      .in('order_group_id', activeOrderGroupIds)
      .order('created_at', { ascending: true });

    if (ordersError) throw ordersError;

    // 3️.해당 주문들의 아이템 가져오기 (order_id 기준으로 메뉴와 조인)
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('order_id, quantity, price, menu_id, menus(name)')
      .in(
        'order_id',
        orders.map((order) => order.id)
      )
      .returns<OrderItem[]>();

    if (orderItemsError) throw orderItemsError;

    // 4️.`order_group_id` 기준으로 주문 합치기
    const groupedOrders = activeOrderGroups.map((group) => {
      const groupOrders = orders.filter(
        (order) => order.order_group_id === group.id
      );
      const totalOrderPrice = groupOrders.reduce(
        (sum, order) => sum + order.total_price,
        0
      );

      // 주문된 메뉴들 합치기 (같은 메뉴는 수량을 합산)
      const groupedItems: {
        [menu_id: string]: { name: string; quantity: number; price: number };
      } = {};

      orderItems
        .filter((item) =>
          groupOrders.some((order) => order.id === item.order_id)
        )
        .forEach((item) => {
          if (!groupedItems[item.menu_id]) {
            groupedItems[item.menu_id] = {
              name: item.menus?.name || 'Unknown',
              quantity: 0,
              price: item.price,
            };
          }
          groupedItems[item.menu_id].quantity += item.quantity;
        });

      return {
        table_id: group.table_id,
        total_price: totalOrderPrice,
        order_group_id: group.id,
        items: Object.values(groupedItems), // 메뉴 리스트
      };
    });

    return NextResponse.json({ orders: groupedOrders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
