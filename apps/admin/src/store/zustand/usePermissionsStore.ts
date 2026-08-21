import { admin } from "@/lib/orpc";
import { create } from "zustand";

export interface AdminPermissionState {
  newOrders: boolean;
  newBookings: boolean;
  loading: boolean;
  fetchPermissions: () => Promise<void>;
  setNewOrderPermission: (allowed: boolean) => Promise<void>;
  setNewBookingPermission: (allowed: boolean) => Promise<void>;
}

export const usePermissionsStore = create<AdminPermissionState>((set) => ({
  newOrders: false,
  newBookings: false,
  loading: false,

  fetchPermissions: async () => {
    set({ loading: true });
    try {
      const [ordersRes, bookingsRes] = await Promise.all([
        admin.permission.get.newOrder(),
        admin.permission.get.newBooking(),
      ]);

      set({
        newOrders: ordersRes.newOrder,
        newBookings: bookingsRes.newBooking,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch permissions via oRPC", error);
      set({ loading: false });
    }
  },

  setNewOrderPermission: async (allowed: boolean) => {
    set({ loading: true });
    try {
      const data = await admin.permission.set.newOrder({
        newOrder: allowed,
      });

      set({
        newOrders: data.newOrder,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to update new order permission via oRPC", error);
      set({ loading: false });
      throw error;
    }
  },

  setNewBookingPermission: async (allowed: boolean) => {
    set({ loading: true });
    try {
      const data = await admin.permission.set.newBooking({
        newBooking: allowed,
      });

      set({
        newBookings: data.newBooking,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to update new booking permission via oRPC", error);
      set({ loading: false });
      throw error;
    }
  },
}));
