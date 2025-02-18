import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // 1: `orders` 테이블에서 기본 정보 가져오기
    let { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, table_id, total_price, status, created_at, payment_id');

    if (ordersError)
      throw new Error(`Orders fetch error: ${ordersError.message}`);

    // 2: 주문 ID 목록 가져오기
    const orderIds = orders.map((order) => order.id);
    if (orderIds.length === 0)
      return NextResponse.json({ orders: [] }, { status: 200 });

    // 3: `order_items`에서 메뉴 정보 가져오기
    let { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('order_id, quantity, price, menus(name)')
      .in('order_id', orderIds);

    if (orderItemsError)
      throw new Error(`Order items fetch error: ${orderItemsError.message}`);

    // 4: `payments` 테이블에서 결제 정보 가져오기
    const paymentIds = orders.map((order) => order.payment_id).filter(Boolean);
    let { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('id, payment_method, status')
      .in('id', paymentIds);

    if (paymentsError)
      throw new Error(`Payments fetch error: ${paymentsError.message}`);

    // 5: 데이터 매핑 (AS 별칭을 여기서 적용)
    const ordersWithDetails = orders.map((order) => {
      const matchedPayment = payments.find((p) => p.id === order.payment_id);
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
          menu_name: item.menus.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };
    });

    return NextResponse.json({ orders: ordersWithDetails }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
