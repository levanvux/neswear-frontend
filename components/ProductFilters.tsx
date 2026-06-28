"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_PRICE = 1_000_000;

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "all";
  const currentSort = searchParams.get("sort") ?? "default";

  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("min_price") ?? 0),
    Number(searchParams.get("max_price") ?? MAX_PRICE),
  ]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all" || value === "default") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/products?${params.toString()}`);
  }

  function updatePrice(value: number[]) {
    setPriceRange(value);
  }

  function commitPrice(value: number[]) {
    const params = new URLSearchParams(searchParams.toString());

    if (value[0] === 0) {
      params.delete("min_price");
    } else {
      params.set("min_price", String(value[0]));
    }

    if (value[1] === MAX_PRICE) {
      params.delete("max_price");
    } else {
      params.set("max_price", String(value[1]));
    }

    router.push(`/products?${params.toString()}`);
  }

  const priceText = useMemo(
    () =>
      `${priceRange[0].toLocaleString("vi-VN")}đ - ${priceRange[1].toLocaleString("vi-VN")}đ`,
    [priceRange],
  );

  return (
    <section className="flex flex-col gap-8 md:flex-row justify-between items-center px-16 py-8">
      <div className="flex gap-2 items-center">
        <h3 className="font-medium">Danh mục</h3>

        <Select
          value={currentCategory}
          onValueChange={(value) => updateParam("category", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="shirt">Áo</SelectItem>
            <SelectItem value="pants">Quần</SelectItem>
            <SelectItem value="jacket">Áo khoác</SelectItem>
            <SelectItem value="underwear">Đồ lót</SelectItem>
            <SelectItem value="accessory">Phụ kiện</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium">Khoảng giá</h3>

          <span className="text-sm text-muted-foreground">{priceText}</span>
        </div>

        <Slider
          value={priceRange}
          max={MAX_PRICE}
          step={1000}
          onValueChange={updatePrice}
          onValueCommit={commitPrice}
          className="mx-auto w-full min-w-56 max-w-xs"
        />
      </div>

      <div className="flex gap-2 items-center">
        <h3 className="font-medium">Sắp xếp</h3>

        <Select
          value={currentSort}
          onValueChange={(value) => updateParam("sort", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Mặc định</SelectItem>
            <SelectItem value="popular">Phổ biến nhất</SelectItem>
            <SelectItem value="price_asc">Giá tăng dần</SelectItem>
            <SelectItem value="price_desc">Giá giảm dần</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
