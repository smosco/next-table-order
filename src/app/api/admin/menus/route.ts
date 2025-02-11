import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// 메뉴 추가 (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, category_id, image_url, options } = body;

    if (!name || !description || !price || !category_id || !image_url) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // 메뉴 추가
    const { data: menuData, error: menuError } = await supabase
      .from('menus')
      .insert([{ name, description, price, category_id, image_url }])
      .select()
      .single();

    if (menuError) throw menuError;
    const menuId = menuData.id;

    // 옵션 그룹 추가 (Promise.all 사용)
    const optionGroupPromises = options.map(async (group: any) => {
      const { data: groupData, error: groupError } = await supabase
        .from('option_groups')
        .insert([
          {
            menu_id: menuId,
            name: group.name,
            is_required: group.is_required,
            max_select: group.max_select,
          },
        ])
        .select()
        .single();

      if (groupError) throw groupError;
      const groupId = groupData.id;

      // 옵션 추가
      if (group.options.length > 0) {
        const optionInsertData = group.options.map((option: any) => ({
          group_id: groupId,
          name: option.name,
          price: option.price,
        }));

        const { error: optionError } = await supabase
          .from('options')
          .insert(optionInsertData);

        if (optionError) throw optionError;
      }
    });

    await Promise.all(optionGroupPromises);

    return NextResponse.json(
      { message: 'Menu with options created successfully.', menuData },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'An unknown error occurred.',
      },
      { status: 500 }
    );
  }
}
