"use client";
import { useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getCartItems } from "@/services/cart";
import CartList from "@/components/CartList";
import CartSummary from "@/components/CartSummary";
import DetailSkeleton from "@/components/DetailSkeleton";

export default function CartPage() {
  const router = useRouter();
  const { loading, accessToken } = useAuth();

  const { error, data, isFetching } = useQuery({
    queryKey: ["cart-items"],
    queryFn: () => getCartItems(accessToken),
    enabled: !loading && !!accessToken,
  });

  useEffect(() => {
    if (!loading && !accessToken) {
      router.push("/login");
    }
  }, [loading, accessToken, router]);

  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const handleSelectItem = (itemId: number, selected: boolean) => {
    setSelectedItemIds((currentIds) => {
      if (selected) {
        return [...currentIds, itemId];
      }

      return currentIds.filter((id) => id !== itemId);
    });
  };

  if (loading || !accessToken || (isFetching && !data)) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <div className="mx4 md:mx-72 mt-10">
        <p>An error has occurred</p>

        <button
          className="mt-4 rounded p-2 text-white cursor-pointer bg-red-400 transition hover:bg-red-500"
          onClick={() => router.refresh()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8 lg:py-10">
        <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          <FiShoppingBag /> Giỏ hàng
        </h1>

        {data && (
          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <section className="min-w-0 overflow-hidden rounded-xl border bg-white">
              <CartList
                items={data}
                selectedItemIds={selectedItemIds}
                onItemSelect={handleSelectItem}
              />
            </section>

            <aside className="min-w-0 lg:sticky lg:top-6">
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <CartSummary items={data} selectedItemIds={selectedItemIds} />
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
