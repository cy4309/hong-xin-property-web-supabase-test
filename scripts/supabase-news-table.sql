-- 在 Supabase SQL Editor 執行此腳本，建立 news 資料表
-- 欄位對應原本 Google Sheet：id | title | slug | excerpt | content | cover | date | seoTitle | seoDesc

CREATE TABLE IF NOT EXISTS public.news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover TEXT,
  date TEXT,
  "seoTitle" TEXT,
  "seoDesc" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 啟用 Row Level Security (RLS)，但允許所有人讀取
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- 允許匿名讀取（公開新聞列表與詳情）
CREATE POLICY "Allow public read access"
  ON public.news
  FOR SELECT
  USING (true);

-- 建立 slug 索引，加速查詢
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);

-- 範例：插入一筆假資料（取消下方註解後執行）
-- INSERT INTO public.news (id, title, slug, excerpt, content, cover, date, "seoTitle", "seoDesc")
-- VALUES ('1', '2025年房貸利率趨勢與資金規劃建議', '2025-mortgage-trends',
--   '隨著央行貨幣政策調整...', '隨著央行貨幣政策調整...', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
--   '2025-03-01', '2025年房貸利率趨勢 | 泓鑫資產管理顧問', '2025年房貸利率趨勢分析...');
