import { create } from "zustand";
import api from "../../lib/axios";

type AdminPermissionState = {
  newOrders: boolean;
  newBookings: boolean;
  loading: boolean;
  fetchPermissions: () => Promise<void>;
  setNewOrderPermission: (allowed: boolean) => Promise<void>;
  setNewBookingPermission: (allowed: boolean) => Promise<void>;
};

export const usePermissionsStore = create<AdminPermissionState>((set) => ({
  newOrders: false,
  newBookings: false,
  loading: false,

  fetchPermissions: async () => {
    set({ loading: true });
    try {
      const [ordersRes, bookingsRes] = await Promise.all([
        api.get("/api/v1/permission/new-order", { withCredentials: true }),
        api.get("/api/v1/permission/new-booking", { withCredentials: true }),
      ]);

      set({
        newOrders: ordersRes.data, // API returns boolean directly
        newBookings: bookingsRes.data, // API returns boolean directly
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch permissions", error);
      set({ loading: false });
    }
  },

  setNewOrderPermission: async (allowed) => {
    set({ loading: true });
    try {
      await api.post("/api/v1/admin/permission/update/new-orders", {
        value: allowed,
      });
      set({ newOrders: allowed, loading: false });
    } catch (error) {
      console.error("Failed to update new order permission", error);
      set({ loading: false });
      throw error;
    }
  },

  setNewBookingPermission: async (allowed) => {
    set({ loading: true });
    try {
      await api.post("/api/v1/admin/permission/update/new-bookings", {
        value: allowed,
      });
      set({ newBookings: allowed, loading: false });
    } catch (error) {
      console.error("Failed to update new booking permission", error);
      set({ loading: false });
      throw error;
    }
  },
}));
