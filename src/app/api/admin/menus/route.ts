import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// 메뉴 추가 (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, category_id, image_url } = body;

    if (!name || !description || !price || !category_id || !image_url) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('menus')
      .insert([{ name, description, price, category_id, image_url }]);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Menu created successfully.', data },
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
