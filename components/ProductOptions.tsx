"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SizeGuide from "./SizeGuide";
import { ProductDetail } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckoutStore } from "@/stores/checkout.store";
import { addCartItem } from "@/services/cart";

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

  const { loading, accessToken } = useAuth();
  const router = useRouter();

  const queryClient = useQueryClient();

  const addCartItemMutation = useMutation({
    mutationFn: (itemData: { productVariantId: number; quantity: number }) => {
      return addCartItem(accessToken, itemData);
    },

    onSuccess: () => {
      toast.success("Đã thêm vào giỏ hàng.");
      queryClient.invalidateQueries({
        queryKey: ["cart-items"],
      });
    },

    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Đã có lỗi xảy ra.");
      }
    },
  });

  const handleAddCartItem = () => {
    if (loading) {
      return;
    }

    if (!accessToken) {
      router.push("/login");
      return;
    }

    const productVariantId = selectedVariant?.id;

    if (!productVariantId) {
      return;
    }

    addCartItemMutation.mutate({
      productVariantId,
      quantity: Math.min(stock, quantity),
    });
  };

  const setBuyNowItem = useCheckoutStore((state) => state.setBuyNowItem);
  const handleBuyNow = () => {
    if (!selectedVariant) {
      return;
    }

    setBuyNowItem({
      productVariantId: selectedVariant.id,
      quantity: Math.min(stock, quantity),
      color: colors[colorIndex],
      size: sizes[sizeIndex],
      stock: selectedVariant.stock,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productPrice: product.price,
      productCategory: product.category,
      thumbnailUrl: product.thumbnailUrl,
    });

    router.push(`/checkout`);
  };

  return (
    <main className="space-y-5">
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
              className="rounded-none cursor-pointer"
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
              className="rounded-none cursor-pointer"
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

      {stock > 0 ? (
        <div className="space-y-2">
          <Button
            variant="outline"
            size="lg"
            className="w-full border-2 cursor-pointer"
            onClick={handleAddCartItem}
            disabled={addCartItemMutation.isPending}
          >
            {addCartItemMutation.isPending
              ? "Đang thêm..."
              : "Thêm vào giỏ hàng"}
          </Button>

          <Button
            size="lg"
            className="w-full cursor-pointer"
            onClick={handleBuyNow}
          >
            Mua ngay
          </Button>
        </div>
      ) : (
        <Button
          size="lg"
          className="w-full cursor-not-allowed bg-gray-700 hover:bg-gray-700"
        >
          Hết hàng
        </Button>
      )}
    </main>
  );
}
