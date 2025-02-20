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
      start = new Date(today);
      start.setDate(today.getDate() - 7);
      end = new Date();
      break;
    case 'month':
      start = new Date(today);
      start.setMonth(today.getMonth() - 1);
      end = new Date();
      break;
    case 'year':
      start = new Date(today);
      start.setFullYear(today.getFullYear() - 1);
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

    // `orders`와 `payments` 테이블을 활용하여 인기 메뉴 계산
    const { data: topMenus, error } = await supabase.rpc('get_popular_menus', {
      start_date: `${start}T00:00:00.000Z`,
      end_date: `${end}T23:59:59.999Z`,
    });

    if (error) throw error;

    if (!topMenus || topMenus.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(topMenus);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
