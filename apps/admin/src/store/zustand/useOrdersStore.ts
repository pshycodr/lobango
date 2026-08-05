import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderItem } from "../../types/orders";

type Order = {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  longitude: string;
  latitude: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

type OrdersState = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  clearOrders: () => void;
  getOrderById: (id: string) => Order | undefined;
};

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
    },
  ),
);
