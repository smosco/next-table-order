import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: 테이블 목록 가져오기
export async function GET() {
  const { data, error } = await supabase.from('tables').select('*');
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: 새 테이블 추가
export async function POST(req: Request) {
  const { name } = await req.json();
  const { data, error } = await supabase
    .from('tables')
    .insert([{ name }])
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
