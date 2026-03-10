import { getSupabase } from "./supabase";

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: string;
  date: string;
  seoTitle: string;
  seoDesc: string;
};

/** Supabase 無資料時的開發用假資料 */
const FALLBACK_ITEM: NewsItem = {
  id: "1",
  title: "2025年房貸利率趨勢與資金規劃建議",
  slug: "2025-mortgage-trends",
  excerpt:
    "隨著央行貨幣政策調整，房貸利率將如何影響您的購屋與轉貸決策？本文整理最新趨勢與實務建議。",
  content: `隨著央行貨幣政策調整，房貸利率將如何影響您的購屋與轉貸決策？

【重點整理】
• 目前房貸利率區間與各家銀行差異
• 轉貸時機判斷與試算要點
• 資金整合與負債優化策略

若有房貸或資金規劃需求，歡迎聯繫泓鑫資產管理顧問，由專業顧問為您量身規劃。`,
  cover: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
  date: "2025-03-01",
  seoTitle: "2025年房貸利率趨勢 | 泓鑫資產管理顧問",
  seoDesc:
    "2025年房貸利率趨勢分析與資金規劃建議，台北房貸轉貸、資金整合專業諮詢。",
};

export async function getNews(): Promise<NewsItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [FALLBACK_ITEM];
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("[getNews] Supabase error:", error.message);
      return [FALLBACK_ITEM];
    }
    const items = (data ?? []) as NewsItem[];
    return items.length > 0 ? items : [FALLBACK_ITEM];
  } catch (err) {
    console.error("[getNews] Error:", err);
    return [FALLBACK_ITEM];
  }
}

/**
 * 新聞搜尋（ILIKE 子字串匹配）
 * 搜尋 title、excerpt、content，支援中英文。
 * @param query 搜尋關鍵字，空字串時回傳全部（依日期排序）
 */
export async function searchNews(query: string): Promise<NewsItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [FALLBACK_ITEM];
  try {
    const { data, error } = await supabase.rpc("search_news", {
      search_query: query.trim(),
    });

    if (error) {
      console.error("[searchNews] Supabase error:", error.message);
      return [FALLBACK_ITEM];
    }
    return (data ?? []) as NewsItem[];
  } catch (err) {
    console.error("[searchNews] Error:", err);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = getSupabase();
  if (!supabase) return FALLBACK_ITEM.slug === slug ? FALLBACK_ITEM : null;
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("[getNewsBySlug] Supabase error:", error.message);
      return FALLBACK_ITEM.slug === slug ? FALLBACK_ITEM : null;
    }
    if (data) return data as NewsItem;
    return FALLBACK_ITEM.slug === slug ? FALLBACK_ITEM : null;
  } catch (err) {
    console.error("[getNewsBySlug] Error:", err);
    return FALLBACK_ITEM.slug === slug ? FALLBACK_ITEM : null;
  }
}
