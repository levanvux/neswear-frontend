"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function changePage(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }

    router.push(`/products?${params.toString()}`);
  }

  return (
    <Pagination className="py-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => page > 1 && changePage(page - 1)}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <PaginationItem key={number}>
            <PaginationLink
              isActive={number === page}
              onClick={() => changePage(number)}
              className={
                number === page
                  ? "bg-[#ef4444] text-white hover:bg-[#ef3939] hover:text-white]"
                  : ""
              }
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => page < totalPages && changePage(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
