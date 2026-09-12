"use client";

import { useSyncExternalStore } from "react";
import { useCheckoutStore } from "@/stores/checkout.store";

export function useHydratedCheckoutStore<T>(
  selector: (state: ReturnType<typeof useCheckoutStore.getState>) => T,
  defaultValue: T,
) {
  const value = useCheckoutStore(selector);

  return useSyncExternalStore(
    () => () => {},
    () => value,
    () => defaultValue,
  );
}
