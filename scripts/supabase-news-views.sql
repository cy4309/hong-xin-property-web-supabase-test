-- 文章瀏覽量統計
-- 在 Supabase SQL Editor 執行此腳本（需先執行 supabase-news-table.sql）

-- 1. 新增 view_count 欄位
ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

-- 2. 瀏覽量 +1 的 RPC（依 slug 更新，回傳更新後的數量）
CREATE OR REPLACE FUNCTION public.increment_news_view(article_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.news
  SET view_count = view_count + 1
  WHERE slug = article_slug
  RETURNING view_count INTO new_count;

  RETURN COALESCE(new_count, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_news_view(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_news_view(TEXT) TO authenticated;
