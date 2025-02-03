import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId'); // URL 파라미터 `categoryId` 사용

  // categoryId가 없으면 전체 메뉴 반환
  if (!categoryId) {
    const { data: menus, error } = await supabase.from('menus').select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(menus, { status: 200 });
  }

  // categoryId로 메뉴 조회
  const { data: menus, error: menuError } = await supabase
    .from('menus')
    .select('*')
    .eq('category_id', categoryId); // `id` 기준 조회

  if (menuError) {
    return NextResponse.json({ error: menuError.message }, { status: 500 });
  }

  return NextResponse.json(menus, { status: 200 });
}
