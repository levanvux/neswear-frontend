import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  image: string;
  slug: string;
  name: string;
  price: number;
  colorCount: number;
  sizeCount: number;
};

export default function ProductCard({
  image,
  slug,
  name,
  price,
  colorCount,
  sizeCount,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group rounded-xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="rounded-xl relative aspect-14/15 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex gap-4 text-sm text-gray-500">
          <span>+{colorCount} Màu sắc</span>
          <span>+{sizeCount} Kích thước</span>
        </div>

        <h3 className="line-clamp-2 min-h-12 font-medium text-gray-900">
          {name}
        </h3>

        <p>
          <strong>{price.toLocaleString("vi-VN")}₫</strong>
        </p>
      </div>
    </Link>
  );
}
