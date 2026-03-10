"use client";

import { useEffect, useState } from "react";
import { incrementNewsView } from "@/lib/sheet";
import { HiEye } from "react-icons/hi2";

type ViewCounterProps = {
  slug: string;
  initialCount?: number;
};

export default function ViewCounter({ slug, initialCount = 0 }: ViewCounterProps) {
  const [count, setCount] = useState<number | null>(initialCount);

  useEffect(() => {
    const key = `news_viewed:${slug}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) return;

    if (typeof window !== "undefined") sessionStorage.setItem(key, "1");

    let mounted = true;
    incrementNewsView(slug).then((newCount) => {
      if (mounted && newCount !== null) setCount(newCount);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
      <HiEye size={16} />
      {count.toLocaleString()} 次瀏覽
    </span>
  );
}
