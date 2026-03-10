/**
 * Supabase Storage 輔助
 * 新聞封面圖存放於 news-covers bucket
 */

const BUCKET = "news-covers";

/** 取得 Storage 檔案的公開 URL */
export function getStoragePublicUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return path;
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}

/** 檢查是否為 Supabase Storage 的 URL */
export function isStorageUrl(url: string): boolean {
  return url.includes("/storage/v1/object/public/");
}
