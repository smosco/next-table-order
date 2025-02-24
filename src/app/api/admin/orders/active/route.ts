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
  menus: { name: string };
  order_item_options: { option_price: number; options: { name: string } }[];
};

export async function GET() {
  try {
    // 1️. 현재 활성화된 주문 그룹 조회 (closed_at이 NULL인 order_groups)
    const { data: activeOrderGroups, error: groupError } = await supabase
      .from('order_groups')
      .select('id, table_id')
      .is('closed_at', null);

    if (groupError || !activeOrderGroups.length) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    const activeOrderGroupIds = activeOrderGroups.map((group) => group.id);

    // 2️. 현재 활성화된 주문들 가져오기 (order_group_id 기준으로 묶기)
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_group_id, table_id, created_at')
      .in('order_group_id', activeOrderGroupIds)
      .order('created_at', { ascending: true });

    if (ordersError) throw ordersError;

    // 3️. 해당 주문들의 아이템 가져오기 (order_id 기준으로 메뉴 + 옵션 조인)
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select(
        `
        order_id, quantity, price, menu_id,
        menus(name),
        order_item_options(option_price, options(name))
      `
      )
      .in(
        'order_id',
        orders.map((order) => order.id)
      )
      .returns<OrderItem[]>();

    if (orderItemsError) throw orderItemsError;

    // 4️. 주문 그룹별로 주문 정리
    const groupedOrders = activeOrderGroups.map((group) => {
      const groupOrders = orders.filter(
        (order) => order.order_group_id === group.id
      );

      // 주문된 메뉴들 합치기 (같은 메뉴는 수량을 합산)
      const groupedItems: {
        [menu_id: string]: {
          name: string;
          quantity: number;
          basePrice: number;
          totalPrice: number;
          options: { name: string; price: number }[];
        };
      } = {};

      let totalOrderPrice = 0;

      orderItems
        .filter((item) =>
          groupOrders.some((order) => order.id === item.order_id)
        )
        .forEach((item) => {
          // 옵션 데이터 구성
          const options = item.order_item_options.map((opt) => ({
            name: opt.options.name,
            price: opt.option_price,
          }));

          // 옵션 가격 총합
          const optionsTotal = options.reduce((sum, opt) => sum + opt.price, 0);
          const itemTotalPrice = (item.price + optionsTotal) * item.quantity;

          if (!groupedItems[item.menu_id]) {
            groupedItems[item.menu_id] = {
              name: item.menus?.name || 'Unknown',
              quantity: 0,
              basePrice: item.price,
              totalPrice: 0,
              options,
            };
          }

          groupedItems[item.menu_id].quantity += item.quantity;
          groupedItems[item.menu_id].totalPrice += itemTotalPrice;

          // 전체 주문 가격 계산 (옵션 포함)
          totalOrderPrice += itemTotalPrice;
        });

      return {
        table_id: group.table_id,
        total_price: totalOrderPrice, // 옵션 포함 가격으로 계산
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
