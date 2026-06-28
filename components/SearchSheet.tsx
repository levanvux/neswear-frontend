"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SearchSheet() {
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const href = keyword.trim()
      ? `/products?search=${encodeURIComponent(keyword)}`
      : "/products";

    setIsOpen(false);
    setKeyword("");

    router.push(href);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button>
          <FiSearch className="hover:cursor-pointer" />
        </button>
      </SheetTrigger>

      <SheetContent side="top" className="px-8 py-20 md:px-24">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            autoFocus
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="h-12 flex-1 rounded-md border border-zinc-300 px-4 outline-none transition focus:border-black"
          />

          <button
            type="submit"
            className="flex h-12 items-center justify-center rounded-md bg-zinc-800 px-6 text-white hover:bg-zinc-900"
          >
            Tìm kiếm
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
