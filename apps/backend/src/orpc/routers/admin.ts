import { adminLogin } from "@/procedures/admin/auth/adminLogin";
import { adminLogout } from "@/procedures/admin/auth/adminLogout";
import { getAllBookings } from "@/procedures/admin/booking/getAllBookings";
import { updateBookingStatus } from "@/procedures/admin/booking/updateBookingStatus";
import { getAllOrders } from "@/procedures/admin/order/getAllOrders";
import { updateOrderStatus } from "@/procedures/admin/order/updateOrderStatus";
import { setNewBookingPermission } from "@/procedures/admin/permission/setNewBookingPermisson";
import { setNewOrderPermission } from "@/procedures/admin/permission/setNewOrderPermission";
import { getNewBookingPermission } from "@/procedures/client/permisson/getNewBookingPermission";
import { getNewOrderPermission } from "@/procedures/client/permisson/getNewOrderPermission";

export const adminRouter = {
  auth: {
    login: adminLogin,
    logout: adminLogout,
  },
  permission: {
    set: {
      newBooking: setNewBookingPermission,
      newOrder: setNewOrderPermission,
    },
    get: {
      newBooking: getNewBookingPermission,
      newOrder: getNewOrderPermission,
    },
  },
  booking: {
    getAllBookings,
    updateBookingStatus,
  },
  order: {
    getAllOrders,
    updateOrderStatus,
  },
};

export type AdminRouter = typeof adminRouter;
