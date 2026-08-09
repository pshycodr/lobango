import { setNewBookingPermission } from "@/procedures/admin/permission/setNewBookingPermisson";
import { setNewOrderPermission } from "@/procedures/admin/permission/setNewOrderPermission";
import { getNewBookingPermission } from "@/procedures/client/permisson/getNewBookingPermission";
import { getNewOrderPermission } from "@/procedures/client/permisson/getNewOrderPermission";

export const adminRouter = {
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
};

export type AdminRouter = typeof adminRouter;
