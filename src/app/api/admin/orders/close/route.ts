import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(req: Request) {
  try {
    const { tableId } = await req.json();

    if (!tableId) {
      return NextResponse.json(
        { error: 'Table ID is required' },
        { status: 400 }
      );
    }

    // 현재 열린 order_group 찾기
    const { data: orderGroup } = await supabase
      .from('order_groups')
      .select('id')
      .eq('table_id', tableId)
      .is('closed_at', null)
      .single();

    if (!orderGroup) {
      return NextResponse.json(
        { error: 'No active order group' },
        { status: 404 }
      );
    }

    // `closed_at` 업데이트 (손님이 떠남)
    await supabase
      .from('order_groups')
      .update({ closed_at: new Date() })
      .eq('id', orderGroup.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
