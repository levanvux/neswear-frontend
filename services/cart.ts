import { fetchApi } from "@/lib/api";
import { PaginatedResponse } from "@/types/common";
import { AddCartItemDto, CartItem } from "@/types/cart";

export function getCartItems(
  access_token: string | null,
): Promise<PaginatedResponse<CartItem>> {
  if (!access_token) {
    throw new Error("No access_token found");
  }

  return fetchApi<PaginatedResponse<CartItem>>("/cart/items", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}

export function addCartItem(
  access_token: string | null,
  dto: AddCartItemDto,
): Promise<CartItem> {
  if (!access_token) {
    throw new Error("No access_token found");
  }

  return fetchApi<CartItem>("/cart/items", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function updateCartItemQuantity(
  access_token: string | null,
  cartItemId: number,
  quantity: number,
): Promise<CartItem | void> {
  if (!access_token) {
    throw new Error("No access_token found");
  }

  if (quantity === 0) {
    return fetchApi<void>(`/cart/items/${cartItemId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      method: "DELETE",
    });
  }

  return fetchApi<CartItem>(`/cart/items/${cartItemId}/quantity`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function deleteCartItems(
  access_token: string | null,
  cartItemIds: number[],
): Promise<void> {
  if (!access_token) {
    throw new Error("No access_token found");
  }

  return fetchApi<void>("/cart/items", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: "DELETE",
    body: JSON.stringify({
      itemIds: cartItemIds,
    }),
  });
}
