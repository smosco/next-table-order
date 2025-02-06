import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// 카테고리 수정 (PATCH)
export async function PATCH(
  req: NextRequest,
  context: { params: { id?: string } }
) {
  try {
    const categoryId = context.params?.id;

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'New category name is required.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', categoryId);

    if (error) throw error;

    return new NextResponse(null, { status: 204 }); // No Content 반환
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

// 카테고리 삭제 (DELETE)
export async function DELETE(
  req: NextRequest,
  context: { params: { id?: string } }
) {
  try {
    const categoryId = context.params?.id;

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Category deleted successfully.' },
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
