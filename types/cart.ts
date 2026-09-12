export type AddCartItemDto = {
  productVariantId: number;
  quantity: number;
};

export type CartItem = {
  id: number;
  productVariantId: number;
  quantity: number;
  color: string;
  size: string;
  stock: number;
  productId: number;
  productName: string;
  productSlug: string;
  productPrice: number;
  productCategory: string;
  thumbnailUrl: string;
};
