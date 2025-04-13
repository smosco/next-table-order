import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // 1. 메뉴들 가져오기 + category 이름 포함
    const { data: menus, error: menuError } = await supabase.from('menus')
      .select(`
        id, name, description, price, image_url, status, category_id,
        categories ( name )
      `);

    if (menuError) throw menuError;

    // 2. 메뉴 ID 목록
    const menuIds = menus.map((menu) => menu.id);

    // 3. menus_option_groups 통해 연결된 옵션 그룹들 가져오기
    const { data: menuOptionGroups, error: mogError } = await supabase
      .from('menu_option_groups')
      .select(
        `
        menu_id,
        option_groups (
          id, name, is_required, max_select,
          options ( id, name, price )
        )
      `
      )
      .in('menu_id', menuIds);

    if (mogError) throw mogError;

    // 4. 메뉴 ID 기준으로 옵션 그룹 정리
    const menuIdToOptions: Record<string, any[]> = {};
    for (const row of menuOptionGroups) {
      const menuId = row.menu_id;
      const optionGroup = row.option_groups;
      if (!menuIdToOptions[menuId]) {
        menuIdToOptions[menuId] = [];
      }
      menuIdToOptions[menuId].push(optionGroup);
    }

    // 5. 메뉴 + 옵션 조합
    const result = menus.map((menu) => ({
      ...menu,
      category_name: menu.categories?.[0]?.name ?? '',
      option_groups: menuIdToOptions[menu.id] ?? [],
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('메뉴 조회 에러:', err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
