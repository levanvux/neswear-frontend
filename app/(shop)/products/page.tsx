import { getProducts } from "@/services/product";
import ProductList from "@/components/ProductList";
import ProductFilters from "@/components/ProductFilters";
import ProductPagination from "@/components/ProductPagination";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const query = {
    search: params.search as string | undefined,
    category: params.category as string | undefined,
    sort: params.sort as "popular" | "price_asc" | "price_desc",
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    page: params.page ? Number(params.page) : undefined,
    limit: params.limit ? Number(params.limit) : undefined,
  };

  const res = await getProducts(query);

  const totalPages = Math.ceil(res.total / res.limit);

  return (
    <main>
      <ProductFilters />
      <div className="space-y-2 text-center mb-10">
        {params.search && (
          <p>
            Từ khóa: <strong>{params.search}</strong>
          </p>
        )}
        <p>Tìm thấy {res.total} sản phẩm.</p>
      </div>
      <ProductList products={res.data} />
      <ProductPagination page={res.page} totalPages={totalPages} />
    </main>
  );
}
