import { PaginatedResponse } from "@/types/common";
import { CartItem } from "@/types/cart";
import CartItemCard from "./CartItemCard";
import Link from "next/link";

type CartListProps = {
  items: PaginatedResponse<CartItem>;
  selectedItemIds: number[];
  onItemSelect: (itemId: number, selected: boolean) => void;
};

export default function CartList({
  items,
  selectedItemIds,
  onItemSelect,
}: CartListProps) {
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between border-b px-4 py-4 sm:px-5">
        <p className="mt-0.5 text-xs text-gray-500">
          {items.total} sản phẩm trong giỏ hàng
        </p>
      </div>

      {items.data.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <p className="mt-4 font-medium text-gray-900">Giỏ hàng đang trống</p>

          <Link
            href="/products"
            className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 hover:cursor-pointer"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="divide-y">
          {items.data.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              selected={selectedItemIds.includes(item.id)}
              onItemSelect={onItemSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
