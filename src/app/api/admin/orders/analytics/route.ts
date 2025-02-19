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
  menus: { name: string }; // 단일 객체로 확실하게 정의
};

export async function GET() {
  try {
    // 1️. `orders` 테이블에서 기본 정보 가져오기
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, table_id, total_price, status, created_at');

    if (ordersError)
      throw new Error(`Orders fetch error: ${ordersError.message}`);

    if (!orders || orders.length === 0)
      return NextResponse.json({ orders: [] }, { status: 200 });

    const orderIds = orders.map((order) => order.id);

    // 2️. `order_items`에서 메뉴 정보 가져오기
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('order_id, quantity, price, menus(name)')
      .in('order_id', orderIds)
      .returns<OrderItem[]>();

    if (orderItemsError)
      throw new Error(`Order items fetch error: ${orderItemsError.message}`);

    // 3️. `payments`에서 결제 정보 가져오기 (order_id 기준)
    let payments: any[] = [];
    let paymentsError = null;

    if (orderIds.length > 0) {
      const { data, error } = await supabase
        .from('payments')
        .select('id, order_id, payment_method, status')
        .in('order_id', orderIds);

      payments = data ?? [];
      paymentsError = error;
    }

    if (paymentsError)
      throw new Error(`Payments fetch error: ${paymentsError.message}`);

    // 4️. 데이터 매핑 (order_id 기준으로 payments 조인)
    const ordersWithDetails = orders.map((order) => {
      const matchedPayment = payments.find((p) => p.order_id === order.id); // ✅ 수정됨
      const matchedItems = orderItems.filter(
        (item) => item.order_id === order.id
      );

      return {
        order_id: order.id,
        table_id: order.table_id,
        total_price: order.total_price,
        order_status: order.status,
        created_at: order.created_at,
        payment_method: matchedPayment?.payment_method || 'Unknown',
        payment_status: matchedPayment?.status || 'Unknown',
        items: matchedItems.map((item) => ({
          menu_name: item.menus?.name || 'Unknown',
          quantity: item.quantity,
          price: item.price,
        })),
      };
    });

    return NextResponse.json({ orders: ordersWithDetails }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
