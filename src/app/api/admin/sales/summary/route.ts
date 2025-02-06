import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    start: start.toISOString().split('T')[0], // YYYY-MM-DD
    end: end.toISOString().split('T')[0],
  };
}

// 매출 요약 API
export async function GET(req: NextRequest) {
  try {
    // 요청에서 `range` 값 가져오기 (기본값: today)
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'today';

    // 기간 계산 (시작일 & 종료일)
    const { start, end } = getStartEndDate(range);

    // console.log(
    //   `Fetching sales summary for range: ${range} (${start} ~ ${end})`
    // );

    // `sales` 테이블에서 총 매출 가져오기
    const { data: sales, error } = await supabase
      .from('sales')
      .select('total_price, created_at')
      .gte('created_at', `${start}T00:00:00.000Z`)
      .lte('created_at', `${end}T23:59:59.999Z`);

    if (error) throw error;

    if (!sales || sales.length === 0) {
      return NextResponse.json(
        { totalRevenue: 0, averageDailyRevenue: 0, totalItemsSold: 0 },
        { status: 200 }
      );
    }

    // 총 매출 계산
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_price, 0);

    // 총 판매된 아이템 개수 계산
    const totalItemsSold = sales.length;

    // 기간 내 중복되지 않는 날짜 수 계산
    const uniqueDates = new Set(
      sales.map((sale) => sale.created_at.split('T')[0])
    );

    // 하루 평균 매출 계산
    const averageDailyRevenue = totalRevenue / (uniqueDates.size || 1);

    return NextResponse.json({
      totalRevenue,
      averageDailyRevenue,
      totalItemsSold,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
