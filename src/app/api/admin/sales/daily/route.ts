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
    start: start.toISOString().split('T')[0], // YYYY-MM-DD
    end: end.toISOString().split('T')[0],
  };
}

// 일별 매출 데이터 API
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'today';

    // 날짜 계산 확인
    const { start, end } = getStartEndDate(range);
    // console.log(`API Debug: Fetching sales from ${start} to ${end}`);

    // Supabase에서 데이터 가져오기
    const { data: sales, error } = await supabase
      .from('sales')
      .select('total_price, created_at')
      .gte('created_at', `${start}T00:00:00.000Z`)
      .lte('created_at', `${end}T23:59:59.999Z`);

    // 데이터가 있는지 확인
    if (error) {
      throw error;
    }

    // console.log('API Debug: Sales Data Fetched:', sales);

    // 데이터가 없으면 빈 배열 반환
    if (!sales || sales.length === 0) {
      //   console.warn('Warning: No sales data found.');
      return NextResponse.json([], { status: 200 });
    }

    // 날짜별 매출 그룹화
    const dailySales = sales.reduce((acc, sale) => {
      const date = sale.created_at.split('T')[0];
      acc[date] = (acc[date] || 0) + sale.total_price;
      return acc;
    }, {} as Record<string, number>);

    // console.log('API Debug: Processed Daily Sales:', dailySales);

    return NextResponse.json(
      Object.entries(dailySales).map(([date, totalRevenue]) => ({
        date,
        totalRevenue,
      }))
    );
  } catch (error: any) {
    // console.error('API Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
