import { createBooking } from "@/procedures/client/booking.ts/createBooking";
import { getBookingById } from "@/procedures/client/booking.ts/getBookingById";
import { createOrder } from "@/procedures/client/orders/createOrder";
import { getOrderById } from "@/procedures/client/orders/getOrderById";
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
    getOrderById,
    createOrder,
  },
  booking: {
    createBooking,
    getBookingById,
  },
  payment: {
    createPayment: createRazorpayOrder,
    verifyPaymentSignature: verifyRazorpaySignature,
  },
};

export type ClientRouter = typeof clientRouter;
