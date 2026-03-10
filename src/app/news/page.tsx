import Link from "next/link";
import { Suspense } from "react";
import { getNews, searchNews } from "@/lib/sheet";
import { generatePageMetadata } from "@/lib/seo";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import NewsSearchForm from "@/components/news/NewsSearchForm";
import NewsCoverImage from "@/components/ui/NewsCoverImage";

export const metadata = generatePageMetadata({
  title: "最新消息",
  description: "泓鑫資產管理顧問最新動態與產業資訊",
  path: "/news",
});

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const items = q?.trim()
    ? await searchNews(q.trim())
    : await getNews();

  return (
    <div className="bg-neutral-50 min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle title="最新消息" subtitle="掌握最新動態" />
        <Suspense fallback={<div className="mb-8 h-12 animate-pulse rounded-2xl bg-neutral-200" />}>
          <NewsSearchForm />
        </Suspense>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Link key={item.id} href={`/news/${item.slug}`}>
              <Card>
                <div className="aspect-video bg-neutral-100 overflow-hidden">
                  {item.cover && (
                    <NewsCoverImage
                      src={item.cover}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      priority={index < 6}
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-deep mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>
                  <span className="text-xs text-neutral-400">{item.date}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-center text-neutral-500 py-12">
            {q?.trim() ? "查無符合「" + q + "」的結果" : "尚無消息"}
          </p>
        )}
      </div>
    </div>
  );
}
