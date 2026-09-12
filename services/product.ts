import { fetchApi } from "@/lib/api";
import { PaginatedResponse } from "@/types/common";
import { ProductCard, ProductDetail, ProductQuery } from "@/types/product";

export async function getProducts(
  query: ProductQuery = {},
): Promise<PaginatedResponse<ProductCard>> {
  const params = new URLSearchParams();

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.category) {
    params.set("category", query.category);
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  if (query.min_price) {
    params.set("min_price", String(query.min_price));
  }

  if (query.max_price) {
    params.set("max_price", String(query.max_price));
  }

  if (query.page) {
    params.set("page", String(query.page));
  }

  if (query.limit) {
    params.set("limit", String(query.limit));
  }

  const queryString = params.toString();

  return fetchApi<PaginatedResponse<ProductCard>>(
    `/products${queryString ? `?${queryString}` : ""}`,
  );
}

export async function getProductBySlug(slug: string) {
  return fetchApi<ProductDetail>(`/products/${slug}`);
}
