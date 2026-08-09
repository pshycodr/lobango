import { getOrders } from "@/procedures/client/orders/getOrders";
import { getNewBookingPermission } from "@/procedures/client/permisson/getNewBookingPermission";
import { getNewOrderPermission } from "@/procedures/client/permisson/getNewOrderPermission";

export const clientRouter = {
  permission: {
    newOrder: getNewOrderPermission,
    newBooking: getNewBookingPermission,
  },
};

export type ClientRouter = typeof clientRouter;
