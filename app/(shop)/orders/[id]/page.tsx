"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import { cancelOrder, getOrder } from "@/services/order";
import { getStatusMessage, getStatusStyle } from "@/lib/order";
import { formatDateVN, formatPriceVN } from "@/lib/format";
import { OrderCancelCode } from "@/types/order";

import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import DetailSkeleton from "@/components/DetailSkeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const cancelOptions = [
  { code: OrderCancelCode.NO_LONGER_NEEDED, label: "Không còn nhu cầu" },
  { code: OrderCancelCode.WRONG_ADDRESS, label: "Sai địa chỉ giao hàng" },
  { code: OrderCancelCode.CHANGE_ORDER, label: "Muốn thay đổi đơn hàng" },
  { code: OrderCancelCode.OTHER, label: "Lý do khác" },
];

const cancelCodeTexts: Record<OrderCancelCode, string> = {
  no_longer_needed: "Không còn nhu cầu",
  wrong_address: "Sai địa chỉ giao hàng",
  change_order: "Thay đổi đơn hàng",
  other: "Lý do khác",

  out_of_stock: "Hết hàng",
  pending_timeout: "Quá thời gian xử lý",
  admin_canceled: "Đơn hàng bị hủy bởi quản trị viên",
};

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();
  const { loading, accessToken } = useAuth();

  const orderId = Number(id);
  const isValidOrderId = Number.isInteger(orderId) && orderId > 0;

  const queryClient = useQueryClient();

  const { error, data, isFetching, refetch } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrder(accessToken, orderId),
    enabled: !loading && !!accessToken && isValidOrderId,
  });

  const [cancelCode, setCancelCode] = useState<OrderCancelCode | null>(null);
  const [cancelDetailedReason, setCancelDetailedReason] = useState<string>("");

  const orderCancellation = useMutation({
    mutationFn: (params: { cancelCode: string; cancelReason: string }) =>
      cancelOrder(accessToken, orderId, params.cancelCode, params.cancelReason),

    onSuccess: () => {
      toast.success("Hủy đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Đã có lỗi xảy ra");
    },
  });

  const handleCancelOrder = () => {
    if (!cancelCode) {
      toast.error("Vui lòng chọn 1 lý do hủy đơn");
      return;
    }

    orderCancellation.mutate({
      cancelCode,
      cancelReason: cancelDetailedReason,
    });
  };

  useEffect(() => {
    if (!loading && !accessToken) {
      router.push("/login");
    }
  }, [loading, accessToken, router]);

  if (!isValidOrderId) {
    return (
      <div className="mx-4 my-10 md:mx-auto md:max-w-4xl">
        <BackButton />

        <div className="mt-8 rounded-xl border bg-white p-6">
          <p className="font-semibold text-red-700">Order ID does not exist</p>
        </div>
      </div>
    );
  }

  if (loading || !accessToken || (isFetching && !data)) {
    return <DetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="mx-4 md:mx-72 my-10 space-y-4">
        <BackButton />

        <p>An error has occurred</p>

        <button
          className="rounded p-2 text-white cursor-pointer bg-red-400 transition hover:bg-red-500"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  //   return (
  //     <div className="mx-4 md:mx-80 my-10 space-y-5">
  //       <BackButton />

  //       <p className="font-semibold text-xl">Thông tin đơn hàng</p>
  //       <p className="font-semibold">ID: {data.id}</p>
  //       <p>Trạng thái: {data.status}</p>
  //       <p>Phương thức thanh toán: {data.paymentMethod}</p>
  //       <p>
  //         Địa chỉ: {data.shippingStreet}, {data.shippingWard}, {data.shippingCity}
  //       </p>
  //       <p>Tổng giá: {data.totalPrice}</p>
  //       <div className="border rounded p-2 space-y-2">
  //         {/* <p className="font-semibold">Các sản phẩm:</p> */}
  //         {data.items.map((item) => (
  //           <p key={item.id}>
  //             <span className="font-semibold">Sản phẩm: {item.productName}</span>{" "}
  //             - Màu: {item.productColor} - Size: {item.productSize}- Giá:{" "}
  //             {item.productPrice} - Số lượng: {item.quantity}
  //           </p>
  //         ))}
  //       </div>
  //       <div className="border rounded p-2 space-y-2">
  //         <p className="font-semibold">Lịch sử đơn hàng</p>
  //         {data.statusHistories.map((history) => (
  //           <p key={history.id}>
  //             <span className="font-semibold">{history.createdAt}</span> -{" "}
  //             {getStatusMessage(history.status)}
  //           </p>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <main className="mx-4 my-6 md:mx-auto md:my-10 md:max-w-4xl">
      <div className="space-y-5">
        <div>
          <BackButton href="/orders">← Danh sách đơn hàng</BackButton>

          <div className="mt-5">
            <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
              Thông tin đơn hàng
            </h1>

            <p className="mt-1 text-sm text-gray-500">Đơn hàng #{data.id}</p>
          </div>
        </div>

        {/* Current status */}
        <section className="rounded-xl border bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Trạng thái đơn hàng</p>

              <p className="mt-1 font-semibold text-gray-900">
                {getStatusMessage(data.status)}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(
                data.status,
              )}`}
            >
              {data.status}
            </span>
          </div>
        </section>

        {/* Cancel order */}
        {(data.status === "pending" || data.status === "confirmed") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="text-white bg-red-500 hover:bg-red-600 hover:cursor-pointer"
              >
                Hủy đơn hàng
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Hủy đơn hàng</DialogTitle>
                <DialogDescription>
                  Vui lòng chọn lý do hủy đơn hàng.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  {cancelOptions.map((option) => (
                    <label
                      key={option.code}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${cancelCode === option.code ? "border-red-400 bg-red-50" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <input
                        type="radio"
                        name="cancelCode"
                        value={option.code}
                        checked={cancelCode === option.code}
                        onChange={() => setCancelCode(option.code)}
                        className="accent-red-500 cursor-pointer"
                      />

                      <span className="text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="cancelDetailedReason"
                    className="text-sm font-medium text-gray-700"
                  >
                    Chi tiết{" "}
                    <span className="font-normal text-gray-400">
                      (không bắt buộc)
                    </span>
                  </label>

                  <textarea
                    id="cancelDetailedReason"
                    value={cancelDetailedReason}
                    onChange={(e) => setCancelDetailedReason(e.target.value)}
                    placeholder="Mô tả thêm lý do..."
                    rows={3}
                    maxLength={200}
                    className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-red-400"
                  />

                  <span className="text-xs text-gray-400">
                    {cancelDetailedReason.length} / 200
                  </span>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="cursor-pointer">
                    Quay lại
                  </Button>
                </DialogClose>

                <Button
                  className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                  onClick={handleCancelOrder}
                  disabled={orderCancellation.isPending}
                >
                  {orderCancellation.isPending ? "Đang hủy..." : "Xác nhận hủy"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Order items */}
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="border-b px-4 py-3">
            <p className="font-semibold text-gray-900">
              Sản phẩm trong đơn hàng
            </p>
          </div>

          <div className="divide-y">
            {data.items.map((item) => {
              const subtotal = item.productPrice * item.quantity;

              return (
                <div key={item.id} className="p-4">
                  <div className="flex min-w-0 flex-col">
                    {/* Product info */}
                    <div>
                      <p className="line-clamp-2 font-medium text-gray-900">
                        {item.productName}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 sm:text-sm">
                        <span className="rounded-md bg-gray-100 px-2 py-1">
                          Màu: {item.productColor}
                        </span>

                        <span className="rounded-md bg-gray-100 px-2 py-1">
                          Size: {item.productSize}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <p className="text-sm text-gray-500">
                        {formatPriceVN(item.productPrice)}
                        {" × "}
                        {item.quantity}
                      </p>

                      <p className="whitespace-nowrap font-semibold text-gray-900">
                        {formatPriceVN(subtotal)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Shipping + Payment */}
        <section className="grid gap-5 md:grid-cols-2">
          {/* Shipping */}
          <div className="rounded-xl border bg-white p-5">
            <p className="font-semibold text-gray-900">Địa chỉ giao hàng</p>

            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>{data.shippingStreet}</p>
              <p>{data.shippingWard}</p>
              <p>{data.shippingCity}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border bg-white p-5">
            <p className="font-semibold text-gray-900">Thanh toán</p>

            <div className="mt-4 flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-500">Phương thức</span>

              <span className="font-medium text-gray-900">
                {data.paymentMethod}
              </span>
            </div>
          </div>
        </section>

        {/* Total */}
        <section className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tổng cộng</span>

            <span className="text-xl font-bold text-gray-900">
              {formatPriceVN(data.totalPrice)}
            </span>
          </div>
        </section>

        {/* Status history */}
        <section className="overflow-hidden rounded-xl border bg-white">
          <div className="border-b px-4 py-3">
            <p className="font-semibold text-gray-900">Lịch sử đơn hàng</p>
          </div>

          <div className="p-5">
            <div className="space-y-6">
              {data.statusHistories.map((history, index) => {
                const isLast =
                  index === (data.statusHistories?.length ?? 0) - 1;

                return (
                  <div key={history.id} className="relative flex gap-4">
                    {/* Connecting line */}
                    {!isLast && (
                      <div className="absolute left-1.75 top-5 h-full w-px bg-gray-200" />
                    )}

                    {/* Dot */}
                    <div
                      className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                        isLast
                          ? "border-gray-900 bg-gray-900"
                          : "border-gray-300 bg-white"
                      }`}
                    />

                    {/* History content */}
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p
                            className={`font-medium ${
                              isLast ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {getStatusMessage(history.status)}
                          </p>

                          {history.status === "canceled" && (
                            <div className="mt-1.5 space-y-0.5 text-sm text-gray-500">
                              {data.cancelCode && (
                                <p>
                                  Lý do:{" "}
                                  <span className="text-gray-700">
                                    {cancelCodeTexts[data.cancelCode]}
                                  </span>
                                </p>
                              )}

                              {data.cancelReason && (
                                <p className="wrap-break-word">
                                  Chi tiết:{" "}
                                  <span className="text-gray-700">
                                    {data.cancelReason}
                                  </span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <p className="shrink-0 text-xs text-gray-400">
                          {formatDateVN(history.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
