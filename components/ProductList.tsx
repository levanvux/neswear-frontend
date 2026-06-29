"use client";

import ProductCard from "./ProductCard";
import type { ProductCard as Product } from "@/types/product";

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="px-16 grid grid-cols-2 gap-16 md:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          image={product.thumbnailUrl}
          slug={product.slug}
          name={product.name}
          price={product.price}
          colorCount={product.colorCount}
          sizeCount={product.sizeCount}
        />
      ))}
    </div>
  );
}
