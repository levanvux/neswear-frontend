"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getOrders } from "@/services/order";
import BackButton from "@/components/BackButton";
import { formatDateVN, formatPriceVN } from "@/lib/format";
import { getStatusMessage, getStatusStyle } from "@/lib/order";

export default function OrdersPage() {
  const router = useRouter();
  const { loading, accessToken } = useAuth();

  const {
    error,
    data: ordersResponse,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(accessToken),
    enabled: !loading && !!accessToken,
  });

  useEffect(() => {
    if (!loading && !accessToken) {
      router.push("/login");
    }
  }, [loading, accessToken, router]);

  if (loading || !accessToken) {
    return <div className="mx-4 md:mx-72 my-10">Loading...</div>;
  }

  if (isFetching && !ordersResponse) {
    return <div className="mx-4 md:mx-72 my-10">Loading orders...</div>;
  }

  if (error || !ordersResponse) {
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
  //       {ordersResponse.data.length === 0 ? (
  //         <p className="text-gray-800">Bạn chưa có đơn hàng nào.</p>
  //       ) : (
  //         <>
  //           <p className="font-semibold">{ordersResponse.total} đơn hàng</p>
  //           {ordersResponse.data.map((order) => (
  //             <div
  //               key={order.id}
  //               className="rounded border border-gray-400 p-2 space-y-2"
  //             >
  //               <p className="font-semibold">#{order.id}</p>
  //               <p>Tổng giá: {order.totalPrice}</p>
  //               <p>Trạng thái: {order.status}</p>
  //               <p>Phương thức thanh toán: {order.paymentMethod}</p>
  //               <p>
  //                 Địa chỉ: {order.shippingStreet}, {order.shippingWard},{" "}
  //                 {order.shippingCity}
  //               </p>
  //               <p>Thời điểm tạo: {order.createdAt}</p>
  //               <button
  //                 className="p-1 text-white rounded bg-green-700 transition hover:bg-green-800 cursor-pointer"
  //                 onClick={() => router.push(`/orders/${order.id}`)}
  //               >
  //                 Xem chi tiết
  //               </button>
  //             </div>
  //           ))}
  //         </>
  //       )}
  //     </div>
  //   );
  // }

  return (
    <main className="mx-4 my-6 md:mx-auto md:my-10 md:max-w-4xl">
      <div className="space-y-6">
        <div>
          <BackButton />

          <div className="mt-5">
            <h1 className="text-2xl font-semibold text-gray-900">
              Đơn hàng của tôi
            </h1>
          </div>
        </div>

        {ordersResponse.data.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            <p className="font-medium text-gray-900">
              Bạn chưa có đơn hàng nào.
            </p>

            <button
              type="button"
              onClick={() => router.push("/products")}
              className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 hover:cursor-pointer"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">
                {ordersResponse.total} đơn hàng
              </p>
            </div>

            <div className="space-y-4">
              {ordersResponse.data.map((order) => (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-xl border bg-white transition hover:shadow-sm"
                >
                  {/* Header */}
                  <div className="flex flex-col gap-2 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Mã đơn hàng</p>

                      <p className="mt-1 font-semibold text-gray-900">
                        #{order.id}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {getStatusMessage(order.status)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 px-4 py-4">
                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Tổng tiền</span>

                      <span className="font-semibold text-gray-900">
                        {formatPriceVN(order.totalPrice)}
                      </span>
                    </div>

                    {/* Payment */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-500">Thanh toán</span>

                      <span className="text-right text-sm font-medium text-gray-800">
                        {order.paymentMethod}
                      </span>
                    </div>

                    {/* Address */}
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>

                      <p className="mt-1 text-sm leading-6 text-gray-800">
                        {order.shippingStreet}, {order.shippingWard},{" "}
                        {order.shippingCity}
                      </p>
                    </div>

                    {/* Created date */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Ngày đặt</span>

                      <span className="text-sm text-gray-800">
                        {formatDateVN(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t bg-gray-50 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 sm:w-auto cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
