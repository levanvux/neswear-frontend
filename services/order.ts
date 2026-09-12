import { fetchApi } from "@/lib/api";
import { CreateOrderItemDto, Order } from "@/types/order";
import { PaginatedResponse } from "../types/common";

export async function createOrder(
  access_token: string | null,
  addressId: number,
  paymentMethod: string,
  items: CreateOrderItemDto[],
) {
  if (!access_token) {
    throw new Error("No access_token found");
  }

  return fetchApi<Order>("/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      addressId,
      paymentMethod,
      items,
    }),
  });
}

export async function getOrders(access_token: string | null) {
  if (!access_token) {
    throw new Error("No access_token found");
  }

  return fetchApi<PaginatedResponse<Order>>("/orders", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export async function getOrder(access_token: string | null, orderId: number) {
  if (!access_token) {
    throw new Error("No access_token found");
  }

  return fetchApi<Order>(`/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export async function cancelOrder(
  access_token: string | null,
  orderId: number,
  cancelCode: string,
  cancelReason: string,
) {
  if (!access_token) {
    throw new Error("No access_token found");
  }

  return fetchApi<Order>(`/orders/${orderId}/cancel`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "PATCH",
    body: JSON.stringify({
      cancelCode,
      cancelReason: cancelReason || undefined,
    }),
  });
}
