-- 新聞封面圖 Storage 設定
-- 在 Supabase SQL Editor 執行此腳本

-- 1. 建立公開 bucket（news-covers）
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-covers', 'news-covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. 允許所有人讀取
CREATE POLICY "Public read for news-covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-covers');

-- 上傳請透過 API（使用 SUPABASE_SERVICE_ROLE_KEY）或 Supabase Dashboard 手動上傳
