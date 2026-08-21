import type { GetAllOrder } from "@lobango/contracts/order";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OrdersState {
  orders: GetAllOrder[];
  setOrders: (orders: GetAllOrder[]) => void;
  clearOrders: () => void;
  getOrderById: (id: string) => GetAllOrder | undefined;
}

export const useOrdersStore = create(
  persist<OrdersState>(
    (set, get) => ({
      orders: [],
      setOrders: (orders) => set({ orders }),
      clearOrders: () => set({ orders: [] }),
      getOrderById: (id) => get().orders.find((order) => order.orderId === id),
    }),
    {
      name: "orders-storage",
    }
  )
);
