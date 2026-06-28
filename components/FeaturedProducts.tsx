"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProductList from "./ProductList";
import { getProducts } from "@/services/product";
import type { ProductCard } from "@/types/product";

const tabs = [
  { label: "ÁO", category: "shirt" },
  { label: "QUẦN", category: "pants" },
  { label: "ÁO KHOÁC", category: "jacket" },
  { label: "ĐỒ LÓT", category: "underwear" },
  { label: "PHỤ KIỆN", category: "accessory" },
];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [products, setProducts] = useState<ProductCard[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      try {
        const res = await getProducts({
          category: activeTab.category,
          limit: 4,
        });

        setProducts(res.data);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [activeTab]);

  return (
    <section>
      <div className="mt-20 mb-10 flex flex-wrap justify-center gap-7 md:gap-10">
        {tabs.map((tab) => (
          <button
            key={tab.category}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 pb-2 text-sm md:text-xl font-semibold cursor-pointer transition-colors ${
              activeTab.category === tab.category
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <ProductList products={products} />
      )}

      <div className="mt-4 mb-10 text-center">
        <Link
          href={`/products?category=${activeTab.category}`}
          className="text-xs md:text-base inline-flex items-center border border-black px-6 py-3 font-medium transition hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444]"
        >
          XEM TẤT CẢ SẢN PHẨM {activeTab.label}
        </Link>
      </div>
    </section>
  );
}
