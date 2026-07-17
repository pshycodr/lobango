import { create } from 'zustand';
import api from '@/lib/axios';

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
        api.get('/api/v1/permission/new-order'),
        api.get('/api/v1/permission/new-booking'),
      ]);

      set({
        newOrders: Boolean(ordersRes.data),
        newBookings: Boolean(bookingsRes.data),
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      set({ loading: false, newOrders: false, newBookings: false });
    }
  },
}));
