import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('option_groups')
      .select(
        `
        id,
        name,
        is_required,
        max_select,
        options (
          id,
          name,
          price
        )
      `
      )
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : '옵션 불러오기 실패',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      is_required,
      options,
    }: {
      name: string;
      is_required: boolean;
      options: { name: string; price: number }[];
    } = body;

    if (!name || options.length === 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { data: group, error: groupError } = await supabase
      .from('option_groups')
      .insert([{ name, is_required, max_select: options.length }])
      .select()
      .single();

    if (groupError) throw groupError;

    const insertOptions = options.map((opt) => ({
      group_id: group.id,
      name: opt.name,
      price: opt.price,
    }));

    const { error: optError } = await supabase
      .from('options')
      .insert(insertOptions);

    if (optError) throw optError;

    return NextResponse.json(
      { message: 'Option group created', group },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
