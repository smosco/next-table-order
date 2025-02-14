import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

type MenuStatus = 'available' | 'sold_out' | 'hidden';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      category_id,
      image_url,
      options,
      status,
    }: {
      name: string;
      description: string;
      price: number;
      category_id: number;
      image_url: string;
      options: any[];
      status?: MenuStatus;
    } = body;

    if (!name || !description || !price || !category_id || !image_url) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // 기본 상태 설정 (없으면 'hidden')
    const menuStatus: MenuStatus = status || 'hidden';

    const { data: menuData, error: menuError } = await supabase
      .from('menus')
      .insert([
        {
          name,
          description,
          price,
          category_id,
          image_url,
          status: menuStatus,
        },
      ])
      .select()
      .single();

    if (menuError) throw menuError;
    const menuId = menuData.id;

    // 옵션 추가
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

// 메뉴 삭제 (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const menuId = searchParams.get('menuId');

    if (!menuId) {
      return NextResponse.json(
        { error: 'menuId is required' },
        { status: 400 }
      );
    }

    // 메뉴 삭제 (CASCADE로 옵션 그룹 & 옵션 자동 삭제됨)
    const { error } = await supabase.from('menus').delete().eq('id', menuId);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Menu and related options deleted successfully.' },
      { status: 200 }
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { menuId, status }: { menuId: string; status: MenuStatus } = body;

    if (!menuId || !status) {
      return NextResponse.json(
        { error: 'menuId and status are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('menus')
      .update({ status })
      .eq('id', menuId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: 'Menu status updated successfully.', data },
      { status: 200 }
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
