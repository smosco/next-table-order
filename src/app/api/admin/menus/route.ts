import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

type MenuStatus = 'available' | 'sold_out' | 'hidden';

interface MenuBody {
  menuId?: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  status?: MenuStatus;
  option_group_ids?: string[]; // 새롭게 포함
}

export async function GET() {
  const { data, error } = await supabase.from('menus').select(`
      *,
      option_groups:menu_option_groups (
        option_group:option_groups (*)
      )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = data.map((menu) => ({
    ...menu,
    options: menu.option_groups.map(
      (rel: { option_group: any }) => rel.option_group
    ),
  }));

  return NextResponse.json(formatted, { status: 200 });
}

// 메뉴 생성
export async function POST(req: NextRequest) {
  try {
    const body: MenuBody = await req.json();
    const {
      name,
      description,
      price,
      category_id,
      image_url,
      status = 'hidden',
      option_group_ids = [],
    } = body;

    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const { data: menuData, error: menuError } = await supabase
      .from('menus')
      .insert([
        {
          name,
          description,
          price,
          category_id,
          image_url,
          status,
        },
      ])
      .select()
      .single();

    if (menuError) throw menuError;

    // menu_option_groups 테이블 연결
    const mappings = option_group_ids.map((id) => ({
      menu_id: menuData.id,
      option_group_id: id,
    }));

    if (mappings.length > 0) {
      const { error: linkError } = await supabase
        .from('menu_option_groups')
        .insert(mappings);
      if (linkError) throw linkError;
    }

    return NextResponse.json(
      { message: 'Menu created successfully', data: menuData },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

// 메뉴 수정
export async function PATCH(req: NextRequest) {
  try {
    const body: MenuBody = await req.json();
    const {
      menuId,
      name,
      description,
      price,
      category_id,
      image_url,
      status,
      option_group_ids,
    } = body;

    if (!menuId) {
      return NextResponse.json(
        { error: 'menuId is required' },
        { status: 400 }
      );
    }

    // 변경된 필드만 업데이트
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (category_id !== undefined) updates.category_id = category_id;
    if (image_url !== undefined) updates.image_url = image_url;
    if (status !== undefined) updates.status = status;

    const { error: updateError } = await supabase
      .from('menus')
      .update(updates)
      .eq('id', menuId);

    if (updateError) throw updateError;

    // 옵션 그룹 연결 갱신
    if (option_group_ids !== undefined) {
      const { error: deleteError } = await supabase
        .from('menu_option_groups')
        .delete()
        .eq('menu_id', menuId);
      if (deleteError) throw deleteError;

      const newLinks = option_group_ids.map((id) => ({
        menu_id: menuId,
        option_group_id: id,
      }));

      if (newLinks.length > 0) {
        const { error: insertError } = await supabase
          .from('menu_option_groups')
          .insert(newLinks);
        if (insertError) throw insertError;
      }
    }

    return NextResponse.json(
      { message: 'Menu updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

// 메뉴 삭제
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

    const { error } = await supabase.from('menus').delete().eq('id', menuId);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Menu deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
