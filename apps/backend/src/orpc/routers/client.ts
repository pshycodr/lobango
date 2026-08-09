import { getOrdersbById } from "@/procedures/client/orders/getOrdersById";
import { placeOrder } from "@/procedures/client/orders/placeOrder";
import { getNewBookingPermission } from "@/procedures/client/permisson/getNewBookingPermission";
import { getNewOrderPermission } from "@/procedures/client/permisson/getNewOrderPermission";

export const clientRouter = {
  permission: {
    newOrder: getNewOrderPermission,
    newBooking: getNewBookingPermission,
  },
  order: {
    getOrdersbById: getOrdersbById,
    placeOrder: placeOrder,
  },
};

export type ClientRouter = typeof clientRouter;
