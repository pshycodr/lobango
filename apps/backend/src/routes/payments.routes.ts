import { Hono } from "hono";
import { verifyRazorpaySignature } from "./payments/verifyPayment";
import { createRazorpayOrder } from "./payments/createOrder";

const paymentRouter = new Hono();

paymentRouter.post("/create-order", createRazorpayOrder);
paymentRouter.post("/verify", verifyRazorpaySignature);

export default paymentRouter;
