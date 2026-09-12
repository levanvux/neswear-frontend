import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";

type BuyNowItem = Omit<CartItem, "id">;

type CheckoutStore = {
  selectedItems: CartItem[];
  setSelectedItems: (items: CartItem[]) => void;
  clearSelectedItems: () => void;

  buyNowItem: BuyNowItem | null;
  setBuyNowItem: (item: BuyNowItem | null) => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      selectedItems: [],
      setSelectedItems: (items: CartItem[]) => set({ selectedItems: items }),
      clearSelectedItems: () => set({ selectedItems: [] }),

      buyNowItem: null,
      setBuyNowItem: (item: BuyNowItem | null) => set({ buyNowItem: item }),

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "cart-selected-items",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
