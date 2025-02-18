import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  // 전체 메뉴 불러오기 (옵션 그룹과 옵션 포함)
  const { data: menus, error } = await supabase.from('menus').select(`
      id, name, description, price, image_url, category_id,
      option_groups (
        id, name, is_required, max_select,
        options ( id, name, price )
      )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(menus, { status: 200 });
}
