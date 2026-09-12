export enum OrderCancelCode {
  NO_LONGER_NEEDED = "no_longer_needed",
  WRONG_ADDRESS = "wrong_address",
  CHANGE_ORDER = "change_order",
  OTHER = "other",
  OUT_OF_STOCK = "out_of_stock",
  PENDING_TIMEOUT = "pending_timeout",
  ADMIN_CANCELED = "admin_canceled",
}

export type CreateOrderItemDto = {
  quantity: number;
  productVariantId: number;
};

export type Order = {
  id: number;
  userId: number | null;
  totalPrice: number;
  status: string;
  cancelCode: OrderCancelCode | null;
  cancelReason: string | null;
  paymentMethod: string;
  shippingStreet: string;
  shippingCity: string;
  shippingWard: string;
  createdAt: string;
  updatedAt: string;

  items: OrderItem[];

  statusHistories: OrderStatusHistory[];
};

export type OrderItem = {
  id: number;
  orderId: number;
  quantity: number;
  productVariantId: number;
  productPrice: number;
  productName: string;
  productColor: string;
  productSize: string;
};

export type OrderStatusHistory = {
  id: number;
  orderId: number;
  status: string;
  createdAt: string;
};
