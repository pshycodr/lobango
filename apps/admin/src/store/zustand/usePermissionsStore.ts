import type {
  GetNewBookingPermissionResponse,
  GetNewOrderPermissionResponse,
  SetNewBookingPermissionRequest,
  SetNewBookingPermissionResponse,
  SetNewOrderPermissionRequest,
  SetNewOrderPermissionResponse,
} from "@lobango/contracts/permissions";
import type { AxiosResponse } from "axios";
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
        api.get<GetNewOrderPermissionResponse>("/api/v1/permission/new-order", {
          withCredentials: true,
        }),
        api.get<GetNewBookingPermissionResponse>(
          "/api/v1/permission/new-booking",
          { withCredentials: true }
        ),
      ]);

      set({
        newOrders: ordersRes.data.new_orders,
        newBookings: bookingsRes.data.new_bookings,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch permissions", error);
      set({ loading: false });
    }
  },

  setNewOrderPermission: async (allowed: boolean) => {
    set({ loading: true });
    try {
      const { data } = await api.post<
        SetNewOrderPermissionResponse,
        AxiosResponse<SetNewOrderPermissionResponse>,
        SetNewOrderPermissionRequest
      >("/api/v1/admin/permission/update/new-orders", {
        value: allowed,
      });

      set({
        newOrders: data.new_orders,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to update new order permission", error);
      set({ loading: false });
      throw error;
    }
  },

  setNewBookingPermission: async (allowed: boolean) => {
    set({ loading: true });
    try {
      const { data } = await api.post<
        SetNewBookingPermissionResponse,
        AxiosResponse<SetNewBookingPermissionResponse>,
        SetNewBookingPermissionRequest
      >("/api/v1/admin/permission/update/new-bookings", {
        value: allowed,
      });

      set({
        newBookings: data.new_bookings,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to update new booking permission", error);
      set({ loading: false });
      throw error;
    }
  },
}));
