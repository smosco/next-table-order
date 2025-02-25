import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface OrderItem {
  id: string; // order_items의 PK
  order_id: string; // 연결된 order ID
  quantity: number; // 주문한 수량
  price: number; // 메뉴 기본 가격
  menu_id: string; // 연결된 메뉴 ID
  menus: {
    name: string; // 메뉴 이름
    price: number; // 메뉴 기본 가격 (중복 저장)
  };
  order_item_options: {
    option_id: string; // 옵션 ID
    option_price: number; // 옵션 가격
    options: {
      name: string; // 옵션 이름
    };
  }[]; // 옵션이 여러 개 있을 수 있으므로 배열로 정의
}

export async function POST(req: Request) {
  try {
    const { tableId, items, totalPrice } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      );
    }

    // 1. 현재 열린 order_group 찾기
    let { data: existingGroup } = await supabase
      .from('order_groups')
      .select('id')
      .eq('table_id', tableId)
      .is('closed_at', null)
      .single();

    // 2. 새 order_group 생성 (없다면)
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

    // 3. 주문 생성 (`payment_status: 'pending'` 추가)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          table_id: tableId,
          total_price: totalPrice,
          status: 'pending', // 주문 상태는 기본적으로 'pending'
          payment_status: 'pending', // 결제 상태 추가
          order_group_id: orderGroupId,
        },
      ])
      .select('id')
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // 4. 주문 항목 추가
    const orderItemsData = items.map((item: any) => ({
      order_id: orderId,
      menu_id: item.menuId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { data: insertedOrderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData)
      .select('id, menu_id');

    if (orderItemsError) throw orderItemsError;

    // 5. 주문 항목 옵션 추가
    const orderItemOptionsData = [];

    for (const orderItem of insertedOrderItems) {
      const item = items.find((i: any) => i.menuId === orderItem.menu_id);
      if (item && item.options) {
        for (const option of item.options) {
          orderItemOptionsData.push({
            order_item_id: orderItem.id,
            option_id: option.optionId,
            option_price: option.price,
          });
        }
      }
    }

    if (orderItemOptionsData.length > 0) {
      const { error: orderItemOptionsError } = await supabase
        .from('order_item_options')
        .insert(orderItemOptionsData);

      if (orderItemOptionsError) throw orderItemOptionsError;
    }

    // 6. 주문 결제 요청(`payments`) 자동 생성 (pending 상태)
    const { error: paymentError } = await supabase.from('payments').insert([
      {
        order_id: orderId,
        amount: totalPrice,
        status: 'pending', // 기본 결제 상태
      },
    ]);

    if (paymentError) throw paymentError;

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

    // 3️. 주문 내역 조회 (order_items + menu_items + order_item_options 조인)
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select(
        `
          id,
          order_id,
          quantity,
          price,
          menu_id,
          menus(name, price),
          order_item_options(option_id, option_price, options(name))
        `
      )
      .in(
        'order_id',
        orders.map((order) => order.id)
      )
      .returns<OrderItem[]>();

    // console.log(orderItems);

    if (orderItemsError) {
      throw orderItemsError;
    }

    // console.log('Order Items:', orderItems);

    // 4️. orders 배열에 order_items 및 옵션 포함하여 응답 데이터 구성
    const ordersWithItems = orders.map((order) => {
      const items = orderItems
        .filter((item) => item.order_id === order.id)
        .map((item) => {
          const menu = item.menus as unknown as { name: string; price: number };

          const optionsArray = Array.isArray(item.order_item_options)
            ? item.order_item_options
            : [];

          const options = optionsArray.map((opt) => ({
            name: opt.options?.name || 'Unknown',
            price: opt.option_price,
          }));

          const optionsTotal = options.reduce((sum, opt) => sum + opt.price, 0);
          const totalPrice = (item.price + optionsTotal) * item.quantity;

          return {
            name: menu.name || 'Unknown',
            quantity: item.quantity,
            basePrice: item.price,
            options,
            totalPrice, // 옵션 포함 가격 저장
          };
        });

      // ✅ order의 `total_price`를 옵션 포함 가격으로 다시 계산
      const recalculatedTotalPrice = items.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      return {
        ...order,
        total_price: recalculatedTotalPrice, // 옵션 포함 가격 반영
        items,
      };
    });

    console.log('FINAL ORDERS:', ordersWithItems);

    return NextResponse.json({ orders: ordersWithItems }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
