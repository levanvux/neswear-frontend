"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItem } from "@/types/cart";
import { useAuth } from "@/contexts/AuthContext";
import { updateCartItemQuantity } from "@/services/cart";
import { useState } from "react";

type CartItemCardProps = {
  item: CartItem;
  selected: boolean;
  onItemSelect: (itemId: number, selected: boolean) => void;
};

export default function CartItemCard({
  item,
  selected,
  onItemSelect,
}: CartItemCardProps) {
  const { accessToken } = useAuth();

  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [quantityChanged, setQuantityChanged] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const updateQuantity = useMutation({
    mutationFn: (quantity: number) =>
      updateCartItemQuantity(accessToken, item.id, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },

    onError: (err) => {
      toast.error("Đã có lỗi xảy ra" + err.message);
    },
  });

  return (
    <div className="flex min-w-0 gap-3 px-4 py-4 sm:gap-4 sm:px-5">
      {/* Checkbox */}
      <div className="flex shrink-0 items-start pt-1">
        <input
          type="checkbox"
          className="h-6 w-6 cursor-pointer sm:h-5 sm:w-5"
          checked={selected}
          onChange={(e) => onItemSelect(item.id, e.target.checked)}
        />
      </div>

      {/* Image */}
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-24">
        <Image
          src={item.thumbnailUrl}
          alt={item.productName}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-5 text-gray-900 sm:text-base">
            {item.productName}
          </h3>

          <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
            Màu: {item.color} <span className="mx-1 text-gray-300">·</span>{" "}
            Size: {item.size}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-3">
          {/* Quantity */}
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="flex items-center overflow-hidden rounded-md border">
              <button
                type="button"
                disabled={quantity <= 0}
                className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300"
                onClick={() => {
                  if (quantity <= 0) {
                    return;
                  }

                  setQuantityChanged(true);
                  setQuantity((prev) => prev - 1);
                }}
              >
                −
              </button>

              <span className="flex h-8 w-9 items-center justify-center border-x text-sm font-medium text-gray-900">
                {quantity}
              </span>

              <button
                type="button"
                disabled={quantity >= item.stock}
                className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300"
                onClick={() => {
                  if (quantity >= item.stock) {
                    return;
                  }

                  setQuantityChanged(true);
                  setQuantity((prev) => prev + 1);
                }}
              >
                +
              </button>
            </div>

            {quantityChanged && (
              <button
                type="button"
                className="h-8 px-1 text-xs font-medium text-red-500 underline underline-offset-2 transition cursor-pointer hover:text-red-400 sm:text-sm"
                onClick={async () => {
                  try {
                    await updateQuantity.mutateAsync(quantity);
                    setQuantityChanged(false);
                  } catch {}
                }}
              >
                Xác nhận
              </button>
            )}
          </div>

          {/* Price */}
          <p className="shrink-0 text-sm font-semibold text-gray-900 sm:text-base">
            {(item.quantity * item.productPrice).toLocaleString("vi-VN")}₫
          </p>
        </div>
      </div>
    </div>
  );
}
