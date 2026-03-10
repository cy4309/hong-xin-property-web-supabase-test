import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStoragePublicUrl } from "@/lib/storage";

const BUCKET = "news-covers";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.UPLOAD_API_KEY;
  if (apiKey) {
    const auth = request.headers.get("authorization")?.replace("Bearer ", "");
    if (auth !== apiKey) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Storage 未設定（需 SUPABASE_SERVICE_ROLE_KEY）" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;

  if (!file || !slug) {
    return NextResponse.json(
      { error: "缺少 file 或 slug" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${slug}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    url: getStoragePublicUrl(path),
    path,
  });
}
