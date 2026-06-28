export interface ProductQuery {
  search?: string;
  category?: string;
  sort?: "popular" | "price_asc" | "price_desc";
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
}

export interface ProductCard {
  id: number;
  name: string;
  price: number;
  thumbnailKey: string;
  thumbnailUrl: string;
  colorCount: number;
  sizeCount: number;
}

export interface ProductImage {
  id: number;
  imageKey: string;
  imageUrl: string;
  productId: number;
}

export interface ProductVariant {
  id: number;
  color: string;
  size: string;
  stock: number;
  productId: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  category: string;
  thumbnailKey: string;
  images: ProductImage[];
  variants: ProductVariant[];
}
