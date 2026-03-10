import Image from "next/image";

type NewsCoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * 新聞封面圖：使用 next/image 優化（懶加載、響應式、WebP）
 */
export default function NewsCoverImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: NewsCoverImageProps) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={450}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
