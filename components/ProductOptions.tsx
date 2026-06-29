"use client";

import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { ProductDetail } from "@/types/product";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SizeGuide from "./SizeGuide";

export default function ProductOptions({
  product,
}: {
  product: ProductDetail;
}) {
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];

  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants.find(
    (v) => v.color === colors[colorIndex] && v.size === sizes[sizeIndex],
  );
  const stock = selectedVariant?.stock ?? 0;

  const updateQuantity = (value: number) => {
    if (stock === 0) {
      setQuantity(0);
      return;
    }

    value = Math.max(1, value);
    value = Math.min(stock, value);

    setQuantity(value);
  };

  return (
    <main className="space-y-7">
      <div>
        <p className="text-sm uppercase tracking-wider text-zinc-500">
          {product.category}
        </p>

        <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>

        <p className="mt-4 text-2xl font-bold">
          {product.price.toLocaleString("vi-VN")}₫
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-medium">Màu sắc</h2>

        <div className="flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <span
              key={index}
              className={`rounded-md border px-3 py-1 text-sm cursor-pointer ${index === colorIndex ? "border-blue-400" : ""}`}
              onClick={() => setColorIndex(index)}
            >
              {color}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 font-medium">Kích thước</h2>

        <div className="flex flex-wrap gap-2">
          {sizes.map((size, index) => (
            <span
              key={index}
              className={`rounded-md border px-3 py-1 text-sm cursor-pointer ${index === sizeIndex ? "border-blue-400" : ""}`}
              onClick={() => setSizeIndex(index)}
            >
              {size}
            </span>
          ))}
        </div>
      </div>

      <SizeGuide
        category={
          product.category as
            | "shirt"
            | "pants"
            | "jacket"
            | "underwear"
            | "accessory"
        }
      />

      <div>
        <h2 className="mb-2 font-medium">Số lượng</h2>

        <div className="flex items-center gap-4">
          <div className="flex overflow-hidden rounded-lg border">
            <Button
              type="button"
              variant="ghost"
              className="rounded-none"
              onClick={() => updateQuantity(quantity - 1)}
            >
              <FiMinus />
            </Button>

            <Input
              type="number"
              min={1}
              max={stock}
              value={quantity}
              onChange={(e) => updateQuantity(Number(e.target.value))}
              className="w-14 rounded-none border-x border-y-0 text-center shadow-none focus-visible:ring-0"
            />

            <Button
              type="button"
              variant="ghost"
              className="rounded-none"
              onClick={() => updateQuantity(quantity + 1)}
            >
              <FiPlus />
            </Button>
          </div>

          <p className="text-sm text-zinc-500">
            Còn <span className="font-medium">{stock}</span> sản phẩm
          </p>
        </div>
      </div>

      <Button size="lg" className="w-full" disabled={stock === 0}>
        {stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
      </Button>
    </main>
  );
}
