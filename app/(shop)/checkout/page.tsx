"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { FiUser, FiPhone, FiMapPin } from "react-icons/fi";

import { useAuth } from "@/contexts/AuthContext";
import { useCheckoutStore } from "@/stores/checkout.store";
import { createAddress } from "@/services/auth";
import { createOrder } from "@/services/order";

import AddressForm from "@/components/AddressForm";
import BackButton from "@/components/BackButton";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

const paymentMethods = [
  {
    label: "Thanh toán khi nhận hàng (giả lập)",
    value: "COD",
  },
  {
    label: "Thanh toán qua QR Code (giả lập)",
    value: "QR",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { loading, user, accessToken, refreshUser } = useAuth();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    ward: "",
  });
  const [creatingAddress, setCreatingAddress] = useState(false);

  const [paymentMethodValue, setPaymentMethodValue] = useState(
    paymentMethods[0].value,
  );
  const [shippingAddressId, setShippingAddressId] = useState<number | null>(
    null,
  );

  const hasHydrated = useCheckoutStore((state) => state._hasHydrated);

  const buyNowItem = useCheckoutStore((state) => state.buyNowItem);
  const setBuyNowItem = useCheckoutStore((state) => state.setBuyNowItem);

  const selectedItems = useCheckoutStore((state) => state.selectedItems);
  const clearSelectedItems = useCheckoutStore(
    (state) => state.clearSelectedItems,
  );

  const isBuyNow = !!buyNowItem;

  const checkoutItems = isBuyNow ? [buyNowItem] : selectedItems;

  const totalPrice = checkoutItems.reduce(
    (total, item) => total + item.quantity * item.productPrice,
    0,
  );

  const orderCreation = useMutation({
    mutationFn: () => {
      if (!selectedShippingAddressId) {
        throw new Error("Vui lòng chọn địa chỉ giao hàng");
      }

      return createOrder(
        accessToken,
        selectedShippingAddressId,
        paymentMethodValue,
        checkoutItems.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      );
    },

    onSuccess: (order) => {
      toast.success("Tạo đơn hàng thành công");
      router.push(`/orders/${order.id}`);

      if (isBuyNow) {
        setBuyNowItem(null);
      } else {
        clearSelectedItems();
      }
    },

    onError: (e) => {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Đã có lỗi xảy ra");
      }
    },
  });

  const handleCreateAddress = async () => {
    const { street, city, ward } = address;
    const hasPartialAddress = street || city;
    const hasFullAddress = street && city && ward;
    if (hasPartialAddress && !hasFullAddress) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ");
      return;
    }

    try {
      setCreatingAddress(true);
      await createAddress(accessToken, {
        street,
        city,
        ward,
        isDefault: true,
      });

      await refreshUser();

      setAddress({
        street: "",
        city: "",
        ward: "",
      });
      setCreatingAddress(false);
    } catch {
      setCreatingAddress(false);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="mx-4 md:mx-72 my-10">Đang tải user info...</div>;
  }

  if (!user) {
    return null;
  }

  if (!hasHydrated) {
    return <div className="mx-4 md:mx-72 my-10">Đang tải giỏ hàng...</div>;
  }

  const defaultAddress = user.addresses.find((a) => a.isDefault === true);
  const selectedShippingAddressId =
    shippingAddressId ?? defaultAddress?.id ?? user.addresses[0]?.id ?? null;

  //   return (
  //     <div className="mx-4 md:mx-80 my-10 space-y-5">
  //       <BackButton />
  //       {user.addresses.length === 0 ? (
  //         <>
  //           {creatingAddress ? (
  //             <p>Đang thêm địa chỉ...</p>
  //           ) : (
  //             <>
  //               <h1 className="text-red-600">
  //                 Bạn không có địa chỉ nào. Vui lòng thêm 1 địa chỉ.
  //               </h1>
  //               <AddressForm setAddress={setAddress} />
  //               <button
  //                 className="mt-4 rounded bg-black px-6 py-3 text-white hover:cursor-pointer hover:bg-gray-800"
  //                 onClick={handleCreateAddress}
  //               >
  //                 Thêm địa chỉ
  //               </button>
  //             </>
  //           )}
  //         </>
  //       ) : (
  //         <>
  //           {checkoutItems.length === 0 ? (
  //             <p className="text-center">
  //               Bạn chưa chọn sản phẩm nào để thanh toán.
  //             </p>
  //           ) : (
  //             <>
  //               <div>
  //                 <h1 className="font-bold">Kiểm tra đơn hàng</h1>
  //                 <ul>
  //                   {checkoutItems.map((item) => (
  //                     <li
  //                       key={item.productVariantId}
  //                       className="grid grid-cols-3 border border-blue-200 rounded-xl p-5"
  //                     >
  //                       <div className="col-span-1">
  //                         <Image
  //                           src={item.thumbnailUrl}
  //                           alt={item.productName}
  //                           height={120}
  //                           width={80}
  //                           className="object-cover rounded-xl"
  //                         />
  //                       </div>
  //                       <div className="col-span-2 space-y-2 text-sm">
  //                         <p className="font-bold">{item.productName}</p>
  //                         <p>
  //                           Màu: {item.color} - Size: {item.size}
  //                         </p>
  //                         <p>Số lượng: {item.quantity}</p>
  //                         <p>Giá: {item.productPrice}đ</p>
  //                       </div>
  //                     </li>
  //                   ))}
  //                 </ul>
  //               </div>
  //               <hr />
  //               <p className="font-bold">Tổng giá: {totalPrice}đ</p>
  //               <hr />
  //               {/* <Select items={paymentMethods}> */}
  //               <div>
  //                 <p className="text-sm font-semibold">
  //                   Chọn phương thức thanh toán:
  //                 </p>
  //                 <Select
  //                   value={paymentMethodValue}
  //                   onValueChange={(value) => setPaymentMethodValue(value)}
  //                 >
  //                   <SelectTrigger className="w-72">
  //                     <SelectValue placeholder="Chọn phương thức thanh toán" />
  //                   </SelectTrigger>
  //                   <SelectContent>
  //                     <SelectGroup>
  //                       {paymentMethods.map((item) => (
  //                         <SelectItem key={item.value} value={item.value}>
  //                           {item.label}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectGroup>
  //                   </SelectContent>
  //                 </Select>
  //               </div>
  //               <hr />
  //               <div className="space-y-3">
  //                 <h2 className="font-bold">Thông tin cá nhân</h2>
  //                 <p className="text-sm">
  //                   <span className="font-semibold">Người dùng:</span>{" "}
  //                   {user.firstName + " " + user.lastName}
  //                 </p>
  //                 <p className="text-sm">
  //                   <span className="font-semibold">Số điện thoại:</span>{" "}
  //                   {user.phoneNumber}
  //                 </p>
  //                 <div>
  //                   <p className="text-sm font-semibold">Địa chỉ:</p>
  //                   <Select
  //                     value={selectedShippingAddressId?.toString() ?? ""}
  //                     onValueChange={(id) => setShippingAddressId(Number(id))}
  //                   >
  //                     <SelectTrigger className="w-72">
  //                       <SelectValue placeholder="Chọn địa chỉ giao hàng" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       <SelectGroup>
  //                         {user.addresses.map((addr) => (
  //                           <SelectItem key={addr.id} value={addr.id.toString()}>
  //                             {addr.street + ", " + addr.ward + ", " + addr.city}
  //                           </SelectItem>
  //                         ))}
  //                       </SelectGroup>
  //                     </SelectContent>
  //                   </Select>
  //                 </div>
  //               </div>
  //               <hr />
  //               <button
  //                 className="p-2 bg-gray-900 text-white hover:bg-gray-700 cursor-pointer rounded-md"
  //                 onClick={() => orderCreation.mutate()}
  //               >
  //                 XÁC NHẬN
  //               </button>
  //             </>
  //           )}
  //         </>
  //       )}
  //     </div>
  //   );
  // }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:py-12">
        <BackButton />

        {user.addresses.length === 0 ? (
          <div className="mx-auto mt-8 max-w-2xl">
            {creatingAddress ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
                <p className="text-sm text-gray-500">Đang thêm địa chỉ...</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-red-600">
                    Chưa có địa chỉ giao hàng
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Thêm địa chỉ giao hàng
                  </h1>

                  <p className="mt-2 text-sm text-gray-500">
                    Vui lòng thêm một địa chỉ để có thể đặt hàng.
                  </p>
                </div>

                <AddressForm setAddress={setAddress} />

                <button
                  className="mt-6 w-full rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-[0.99]"
                  onClick={handleCreateAddress}
                >
                  Thêm địa chỉ
                </button>
              </div>
            )}
          </div>
        ) : checkoutItems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h1 className="font-semibold text-gray-900">
              Chưa có sản phẩm để thanh toán
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Bạn chưa chọn sản phẩm nào để thanh toán.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="my-6 min-w-0 md:my-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Kiểm tra đơn hàng
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Vui lòng kiểm tra thông tin trước khi hoàn tất đơn hàng.
              </p>
            </div>

            <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* LEFT */}
              <div className="min-w-0 space-y-4 sm:space-y-6">
                {/* Products */}
                <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-100 px-4 py-4 sm:px-5 md:px-6">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-semibold text-gray-900">Sản phẩm</h2>

                      <span className="shrink-0 text-xs text-gray-500 sm:text-sm">
                        {checkoutItems.length} sản phẩm
                      </span>
                    </div>
                  </div>

                  <ul className="min-w-0 divide-y divide-gray-100">
                    {checkoutItems.map((item) => (
                      <li
                        key={item.productVariantId}
                        className="flex min-w-0 gap-3 p-4 sm:gap-4 sm:p-5 md:p-6"
                      >
                        {/* Image */}
                        <div className="shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.productName}
                            width={90}
                            height={120}
                            className="h-24 w-16 object-cover sm:h-28 sm:w-20 md:h-32 md:w-24"
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 wrap-break-word text-sm font-semibold leading-5 text-gray-900 sm:text-base">
                            {item.productName}
                          </h3>

                          <div className="mt-2 flex min-w-0 flex-wrap gap-1.5 text-[11px] sm:gap-2 sm:text-xs">
                            <span className="max-w-full rounded-md bg-gray-100 px-2 py-1 text-gray-600">
                              Màu: {item.color}
                            </span>

                            <span className="max-w-full rounded-md bg-gray-100 px-2 py-1 text-gray-600">
                              Size: {item.size}
                            </span>

                            <span className="max-w-full rounded-md bg-gray-100 px-2 py-1 text-gray-600">
                              SL: {item.quantity}
                            </span>
                          </div>

                          <p className="mt-3 text-sm font-semibold text-gray-900 sm:text-base">
                            {item.productPrice.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Customer information */}
                <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
                  <h2 className="mb-5 font-semibold text-gray-900">
                    Thông tin giao hàng
                  </h2>

                  <div className="space-y-5 sm:space-y-6">
                    {/* Name */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <FiUser className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />

                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                          Người nhận
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-gray-900 sm:text-base">
                          {user.firstName + " " + user.lastName}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <FiPhone className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />

                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                          Số điện thoại
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-gray-900 sm:text-base">
                          {user.phoneNumber}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <FiMapPin className="mt-1 h-6 w-6 shrink-0 sm:h-7 sm:w-7" />

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                          Địa chỉ giao hàng
                        </p>

                        <Select
                          value={selectedShippingAddressId?.toString() ?? ""}
                          onValueChange={(id) =>
                            setShippingAddressId(Number(id))
                          }
                        >
                          <SelectTrigger className="mt-2 h-auto min-h-11 w-full min-w-0 rounded-xl border-gray-200 bg-gray-50 px-3 py-2 text-left text-sm">
                            <SelectValue placeholder="Chọn địa chỉ giao hàng" />
                          </SelectTrigger>

                          <SelectContent className="max-w-[calc(100vw-2rem)]">
                            <SelectGroup>
                              {user.addresses.map((addr) => (
                                <SelectItem
                                  key={addr.id}
                                  value={addr.id.toString()}
                                  className="max-w-full"
                                >
                                  {addr.street}, {addr.ward}, {addr.city}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment */}
                <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
                  <h2 className="mb-5 font-semibold text-gray-900">
                    Chọn phương thức thanh toán
                  </h2>

                  <Select
                    value={paymentMethodValue}
                    onValueChange={(value) => setPaymentMethodValue(value)}
                  >
                    <SelectTrigger className="h-12 w-full min-w-0 rounded-xl border-gray-200 bg-gray-50 text-sm">
                      <SelectValue placeholder="Chọn phương thức thanh toán" />
                    </SelectTrigger>

                    <SelectContent className="max-w-[calc(100vw-2rem)]">
                      <SelectGroup>
                        {paymentMethods.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </section>
              </div>

              {/* RIGHT - ORDER SUMMARY */}
              <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
                <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Tóm tắt đơn hàng
                    </h2>
                  </div>

                  <div className="space-y-4 p-4 sm:p-5">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-500">Tạm tính</span>

                      <span className="shrink-0 font-medium text-gray-900">
                        {totalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-500">Phí vận chuyển</span>

                      <span className="shrink-0 font-medium text-gray-900">
                        Miễn phí
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-end justify-between gap-3">
                        <span className="text-sm font-semibold text-gray-900 sm:text-base">
                          Tổng cộng
                        </span>

                        <span className="shrink-0 text-xl font-bold text-gray-900 sm:text-2xl">
                          {totalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>

                    <button
                      className="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-bold tracking-wide text-white transition hover:cursor-pointer hover:bg-gray-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:py-4"
                      onClick={() => orderCreation.mutate()}
                      disabled={orderCreation.isPending}
                    >
                      {orderCreation.isPending ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
