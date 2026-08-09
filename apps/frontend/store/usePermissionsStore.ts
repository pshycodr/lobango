import { client } from "@/lib/orpc";
import { create } from "zustand";

interface PermissionsState {
  newOrders: boolean | null;
  newBookings: boolean | null;
  loading: boolean;
  fetchPermissions: () => Promise<void>;
}

export const usePermissionsStore = create<PermissionsState>((set) => ({
  newOrders: null,
  newBookings: null,
  loading: true,

  fetchPermissions: async () => {
    try {
      set({ loading: true });

      const [ordersRes, bookingsRes] = await Promise.all([
        client.permission.newOrder(),
        client.permission.newBooking(),
      ]);

      set({
        newOrders: ordersRes.new_orders,
        newBookings: bookingsRes.new_bookings,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      set({ loading: false, newOrders: false, newBookings: false });
    }
  },
}));
