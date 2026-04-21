# Supabase 新聞資料設定

本專案已從 Google Apps Script (GAS) + Google Sheet 遷移至 Supabase。

---

## 步驟一：建立 Supabase 專案

1. 前往 [supabase.com](https://supabase.com) 註冊／登入
2. 點擊 **New Project**
3. 填寫專案名稱、資料庫密碼，選擇區域（建議選離台灣較近的 `Singapore`）
4. 建立完成後進入專案 Dashboard

---

## 步驟二：建立 news 資料表

1. 左側選單點 **SQL Editor**
2. 點 **New query**
3. 複製 `scripts/supabase-news-table.sql` 的內容貼上
4. 點 **Run** 執行

完成後會建立 `news` 資料表，並設定允許公開讀取。

---

## 步驟 2.5：新聞搜尋（可選）

若要啟用新聞搜尋功能，請再執行 `scripts/supabase-news-search.sql`：

1. SQL Editor → New query
2. 複製 `supabase-news-search.sql` 內容貼上
3. 點 **Run** 執行

會建立 `search_news` RPC 函數，使用 ILIKE 子字串匹配搜尋 title、excerpt、content。

---

## 步驟 2.6：文章瀏覽量統計（可選）

若要啟用瀏覽量統計，請執行 `scripts/supabase-news-views.sql`：

1. SQL Editor → New query
2. 複製 `supabase-news-views.sql` 內容貼上
3. 點 **Run** 執行

會建立 `view_count` 欄位與 `increment_news_view` RPC，文章詳情頁載入時會自動 +1。

---

## 步驟 2.7：圖片存儲（可選）

若要使用 Supabase Storage 存放新聞封面圖，請執行 `scripts/supabase-storage-news-covers.sql`：

1. SQL Editor → New query
2. 複製 `supabase-storage-news-covers.sql` 內容貼上
3. 點 **Run** 執行

會建立 `news-covers` 公開 bucket。上傳方式：
- **API**：`POST /api/upload/news-cover`，需設定 `SUPABASE_SERVICE_ROLE_KEY`
- **手動**：Supabase Dashboard → Storage → news-covers → Upload

上傳後將回傳的 URL 填入 news 表的 `cover` 欄位。

---

## 步驟三：取得 API 金鑰

1. 左側選單點 **Project Settings**（齒輪圖示）
2. 點 **API** 分頁
3. 複製：
   - **Project URL** → 對應 `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** 金鑰 → 對應 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 步驟四：設定環境變數

在專案根目錄的 `.env.local` 新增或修改：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的專案ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon金鑰

# 圖片上傳 API（從 Project Settings → API → service_role 取得）
# SUPABASE_SERVICE_ROLE_KEY=你的service_role金鑰
# UPLOAD_API_KEY=自訂金鑰  # 若設定，上傳時需在 Header 帶 Authorization: Bearer {金鑰}
# CRON_SECRET=自訂金鑰  # Vercel Cron 保活用，需在 Vercel 專案設定
```

> 舊的 `NEXT_PUBLIC_SHEET_API` 可刪除，已不再使用。

---

## 步驟五：匯入假資料（可選）

在 Supabase **Table Editor** → 選 `news` 表 → **Insert row**，或執行 SQL：

```sql
INSERT INTO public.news (id, title, slug, excerpt, content, cover, date, "seoTitle", "seoDesc")
VALUES (
  '1',
  '2025年房貸利率趨勢與資金規劃建議',
  '2025-mortgage-trends',
  '隨著央行貨幣政策調整，房貸利率將如何影響您的購屋與轉貸決策？本文整理最新趨勢與實務建議。',
  '隨著央行貨幣政策調整，房貸利率將如何影響您的購屋與轉貸決策？

【重點整理】
• 目前房貸利率區間與各家銀行差異
• 轉貸時機判斷與試算要點
• 資金整合與負債優化策略

若有房貸或資金規劃需求，歡迎聯繫泓鑫資產管理顧問，由專業顧問為您量身規劃。',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  '2025-03-01',
  '2025年房貸利率趨勢 | 泓鑫資產管理顧問',
  '2025年房貸利率趨勢分析與資金規劃建議，台北房貸轉貸、資金整合專業諮詢。'
);
```

---

## 步驟六：驗證

1. 執行 `npm run dev` 啟動開發伺服器
2. 開啟首頁與 `/news` 頁面，確認新聞列表正常顯示
3. 點擊任一則新聞，確認詳情頁可正常開啟

若未設定 Supabase 環境變數，會自動使用內建假資料，方便本地開發。

---

## Supabase 保活（Vercel Cron）

Supabase 免費方案在專案未活躍一段時間後會暫停。若部署於 Vercel，可透過 Cron **每天至少一次** 對 `news` 表做實際 SELECT 以維持活躍：

1. 在 Vercel 專案設定 **Environment Variables** 新增 `CRON_SECRET`（自訂隨機字串，至少 16 字元）
2. 專案已包含 `vercel.json` 與 `/api/cron/keep-alive`，部署後會自動執行
3. 排程：`0 0 * * *`（每日 00:00 UTC）

> Vercel 呼叫時會自動帶 `Authorization: Bearer {CRON_SECRET}`，未設定時則不驗證。

---

## 從 Google Sheet 遷移既有資料

若你已有 Google Sheet 的資料，可：

1. 在 Sheet 中匯出為 CSV
2. 用 Excel / Google Sheets 開啟，確認欄位對應：`id`, `title`, `slug`, `excerpt`, `content`, `cover`, `date`, `seoTitle`, `seoDesc`
3. 在 Supabase **Table Editor** → `news` → **Import data from CSV** 匯入

或撰寫一次性腳本，從 GAS API 抓取後寫入 Supabase。
