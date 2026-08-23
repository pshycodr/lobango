import { createBooking } from "@/procedures/client/booking.ts/createBooking";
import { getBookingById } from "@/procedures/client/booking.ts/getBookingById";
import { cancelOrder } from "@/procedures/client/orders/cancelOrder";
import { createOrder } from "@/procedures/client/orders/createOrder";
import { getOrderById } from "@/procedures/client/orders/getOrderById";
import { getNewBookingPermission } from "@/procedures/client/permisson/getNewBookingPermission";
import { getNewOrderPermission } from "@/procedures/client/permisson/getNewOrderPermission";
import { createRazorpayOrder } from "@/procedures/payments/createRazorpayOrder";
import { verifyRazorpaySignature } from "@/procedures/payments/verifyRazorpaySignature";
import { sendOtpEmail } from "@/procedures/shared/otp/sendOtpEmail";
import { verifyOtp } from "@/procedures/shared/otp/verifyOtp";

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
    cancelOrder,
  },
  booking: {
    createBooking,
    getBookingById,
  },
  payment: {
    createPayment: createRazorpayOrder,
    verifyPaymentSignature: verifyRazorpaySignature,
  },
  otp: {
    sendOtpEmail,
    verifyOtp,
  },
};

export type ClientRouter = typeof clientRouter;
