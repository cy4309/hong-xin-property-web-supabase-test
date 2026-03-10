-- 新聞搜尋：ILIKE 子字串匹配（簡化版）
-- 在 Supabase SQL Editor 執行此腳本（需先執行 supabase-news-table.sql）
-- 搜尋範圍：title、excerpt、content，支援中英文

CREATE OR REPLACE FUNCTION public.search_news(search_query TEXT)
RETURNS SETOF public.news
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF search_query IS NULL OR trim(search_query) = '' THEN
    RETURN QUERY SELECT * FROM public.news ORDER BY date DESC;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT *
  FROM public.news
  WHERE
    title ILIKE '%' || search_query || '%'
    OR excerpt ILIKE '%' || search_query || '%'
    OR content ILIKE '%' || search_query || '%'
  ORDER BY date DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_news(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.search_news(TEXT) TO authenticated;
