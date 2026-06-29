"use client";

import Link from "next/link";

export default function ProductDetailError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <h2 className="text-2xl font-semibold">
        Không thể tải thông tin sản phẩm
      </h2>

      <p className="mt-2 text-zinc-500">Đã xảy ra lỗi khi tải dữ liệu.</p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-md border px-5 py-2 hover:bg-zinc-100"
        >
          Thử lại
        </button>

        <Link
          href="/products"
          className="rounded-md bg-black px-5 py-2 text-white hover:bg-zinc-800"
        >
          Xem tất cả sản phẩm
        </Link>
      </div>
    </div>
  );
}
