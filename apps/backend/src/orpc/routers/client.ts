import { getOrdersbById } from "@/procedures/client/orders/getOrdersById";
import { getNewBookingPermission } from "@/procedures/client/permisson/getNewBookingPermission";
import { getNewOrderPermission } from "@/procedures/client/permisson/getNewOrderPermission";

export const clientRouter = {
  permission: {
    newOrder: getNewOrderPermission,
    newBooking: getNewBookingPermission,
  },
  order: {
    getOrdersbById: getOrdersbById,
  },
};

export type ClientRouter = typeof clientRouter;
