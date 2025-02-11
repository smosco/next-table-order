import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ menuId: string }> }
) {
  try {
    const { menuId } = await params;

    // 메뉴 가져오기 + 옵션 그룹 및 옵션 포함
    const { data: menu, error } = await supabase
      .from('menus')
      .select(
        `
        id, name, description, price, image_url,
        option_groups (
          id, name, is_required, max_select,
          options ( id, name, price )
        )
      `
      )
      .eq('id', menuId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(menu, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}
