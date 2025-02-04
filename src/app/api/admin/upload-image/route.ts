import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    // FormData 처리
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Image file is required.' },
        { status: 400 }
      );
    }

    const bucketName = 'menu-images';

    // 확장자 추출
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `menu-images/${fileName}`;

    // Supabase Storage에 이미지 업로드
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { contentType: file.type });

    if (error) throw error;

    // 업로드된 이미지 URL 가져오기
    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    if (!publicData?.publicUrl) {
      throw new Error('Failed to retrieve image URL.');
    }

    return NextResponse.json(
      { imageUrl: publicData.publicUrl },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'An unknown error occurred.' },
      { status: 500 }
    );
  }
}
