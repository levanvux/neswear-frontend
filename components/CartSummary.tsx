"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginatedResponse } from "@/types/common";
import { CartItem } from "@/types/cart";
import { useAuth } from "@/contexts/AuthContext";
import { deleteCartItems } from "@/services/cart";
import { useCheckoutStore } from "@/stores/checkout.store";

type CartSummaryProps = {
  items: PaginatedResponse<CartItem>;
  selectedItemIds: number[];
};

export default function CartSummary({
  items,
  selectedItemIds,
}: CartSummaryProps) {
  const router = useRouter();
  const { accessToken } = useAuth();

  const setSelectedItems = useCheckoutStore((state) => state.setSelectedItems);
  const setBuyNowItem = useCheckoutStore((state) => state.setBuyNowItem);

  const queryClient = useQueryClient();

  const deleteBatch = useMutation({
    mutationFn: (cartItemIds: number[]) =>
      deleteCartItems(accessToken, cartItemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },
    onError: () => {
      toast.error("Đã có lỗi xảy ra");
    },
  });

  const selectedItems = items.data.filter((item) =>
    selectedItemIds.includes(item.id),
  );

  const selectedQuantity = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = selectedItems.reduce((total, item) => {
    return total + item.quantity * item.productPrice;
  }, 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    setSelectedItems(selectedItems);
    setBuyNowItem(null);
    router.push("/checkout");
  };

  const handleRemoveItems = async () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }

    try {
      await deleteBatch.mutateAsync(selectedItemIds);
    } catch {}
  };

  //   return (
  //     <div className="flex flex-col gap-2">
  //       <h1 className="text-xl">Đơn hàng</h1>
  //       <span>Đã chọn {selectedQuantity} sản phẩm</span>
  //       <span>Tạm tính: {subtotal.toLocaleString("vi-VN")}₫</span>
  //       <button
  //         className=" w-40 bg-emerald-500 text-white p-2 rounded-md cursor-pointer mb-5 hover:bg-emerald-800"
  //         onClick={handleCheckout}
  //       >
  //         Đặt hàng
  //       </button>
  //       <button
  //         className="w-40 bg-red-500 text-white p-2 rounded-md cursor-pointer mb-5 hover:bg-red-700"
  //         onClick={handleRemoveItems}
  //       >
  //         Xóa đã chọn
  //       </button>
  //       <hr />
  //     </div>
  //   );
  // }
  return (
    <div className="flex flex-col">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Tóm tắt đơn hàng
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Đã chọn {selectedItems.length} sản phẩm
        </p>
      </div>

      <div className="space-y-3 py-5">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-500">Số lượng</span>

          <span className="font-medium text-gray-900">{selectedQuantity}</span>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-500">Tạm tính</span>

          <span className="font-medium text-gray-900">
            {subtotal.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      <div className="border-t py-4">
        <div className="flex items-end justify-between gap-4">
          <span className="font-medium text-gray-700">Tổng cộng</span>

          <span className="text-xl font-bold text-gray-900">
            {subtotal.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm md:text-base font-semibold text-white transition hover:bg-emerald-600 cursor-pointer"
          onClick={handleCheckout}
        >
          Đặt hàng
        </button>

        <button
          className="w-full rounded-lg border border-red-200 px-4 py-3 text-sm md:text-base font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
          onClick={handleRemoveItems}
        >
          {deleteBatch.isPending ? "Đang xóa..." : "Xóa đã chọn"}
        </button>
      </div>
    </div>
  );
}
