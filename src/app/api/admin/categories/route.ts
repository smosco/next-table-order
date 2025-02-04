import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// 카테고리 추가 (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select(); // 데이터 반환을 위해 select() 추가

    if (error) throw error;

    if (!data || data.length === 0) {
      // data가 null이거나 비어있는 경우 체크
      throw new Error('Category insertion failed.');
    }

    return NextResponse.json(
      { message: 'Category created successfully.', id: data[0].id },
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
