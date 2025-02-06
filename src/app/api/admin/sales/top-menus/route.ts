import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 특정 기간을 계산하는 함수
function getStartEndDate(range: string): { start: string; end: string } {
  const today = new Date();
  let start: Date, end: Date;

  switch (range) {
    case 'week':
      start = new Date(today.setDate(today.getDate() - 7));
      end = new Date();
      break;
    case 'month':
      start = new Date(today.setMonth(today.getMonth() - 1));
      end = new Date();
      break;
    case 'year':
      start = new Date(today.setFullYear(today.getFullYear() - 1));
      end = new Date();
      break;
    case 'today':
    default:
      start = new Date();
      end = new Date();
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

// 인기 메뉴 TOP 5 조회 API
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'today';

    // 기간 계산
    const { start, end } = getStartEndDate(range);

    // console.log(`API Debug: Fetching top menus from ${start} to ${end}`);

    // NOTE(@smosco):
    // 특정 기간별 인기 메뉴 TOP 5를 조회하는 API
    // - Supabase의 `sales` 테이블에서 `menu_id`별 총 판매량을 집계하여 인기 메뉴 반환
    // - `GROUP BY`가 필요하기 때문에 Supabase의 `from()`을 사용하여 VIEW에서 데이터 조회
    // - 초기에는 `rpc()`를 시도했으나, Supabase의 `rpc()`는 SQL 함수 호출용이므로 `from('popular_menus')`로 변경
    // - `popular_menus` VIEW에는 `menu_id`, 총 판매량(`SUM(quantity)`), 총 매출(`SUM(total_price)`)을 포함
    // - `created_at`을 추가하여 특정 기간별 데이터 필터링이 가능하도록 개선
    const { data: sales, error } = await supabase
      .from('popular_menus') // View를 조회할 땐 from()을 사용해야 함!
      .select('*')
      .gte('created_at', `${start}T00:00:00.000Z`)
      .lte('created_at', `${end}T23:59:59.999Z`)
      .order('total_quantity', { ascending: false })
      .limit(5);

    if (error) throw error;

    if (!sales || sales.length === 0) {
      //   console.warn('Warning: No popular menu items found.');
      return NextResponse.json([], { status: 200 });
    }

    // console.log('Aggregated Sales Data:', sales);

    // TypeScript를 위한 명시적 타입 정의
    type SalesWithMenu = {
      menu_id: string;
      total_quantity: number;
      total_revenue: number;
      menu_name: string;
    };

    // Supabase가 반환한 데이터를 타입 변환
    const typedSales = sales as SalesWithMenu[];

    // 최종 JSON 응답 데이터 변환
    const popularMenus = typedSales.map((item) => ({
      menuId: item.menu_id,
      menuName: item.menu_name, // `menus.name`을 직접 참조
      quantitySold: item.total_quantity, // 누적 판매량
      totalRevenue: item.total_revenue, // 누적 매출
    }));

    return NextResponse.json(popularMenus);
  } catch (error: any) {
    // console.error('API Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
