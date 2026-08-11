import { addBooking } from "@/procedures/client/booking.ts/addBooking";
import { getBookingById } from "@/procedures/client/booking.ts/getBookingById";
import { getOrdersbById } from "@/procedures/client/orders/getOrdersById";
import { placeOrder } from "@/procedures/client/orders/placeOrder";
import { getNewBookingPermission } from "@/procedures/client/permisson/getNewBookingPermission";
import { getNewOrderPermission } from "@/procedures/client/permisson/getNewOrderPermission";
import { createRazorpayOrder } from "@/procedures/payments/createRazorpayOrder";
import { verifyRazorpaySignature } from "@/procedures/payments/verifyRazorpaySignature";

export const clientRouter = {
  permission: {
    get: {
      newOrder: getNewOrderPermission,
      newBooking: getNewBookingPermission,
    },
  },
  order: {
    getOrdersbById,
    placeOrder,
  },
  booking: {
    addBooking,
    getBookingById,
  },
  payment: {
    createPayment: createRazorpayOrder,
    verifyPaymentSignature: verifyRazorpaySignature,
  },
};

export type ClientRouter = typeof clientRouter;
