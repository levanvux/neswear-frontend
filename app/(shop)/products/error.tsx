"use client";

export default function ProductsError({ reset }: { reset: () => void }) {
  return (
    <div className="py-16 text-center">
      <h2 className="text-xl font-semibold text-gray-800">
        Không thể tải sản phẩm...
      </h2>

      <button
        onClick={reset}
        className="mt-4 rounded bg-black px-4 py-2 text-white hover:bg-gray-700 hover:cursor-pointer"
      >
        Thử lại
      </button>
    </div>
  );
}
