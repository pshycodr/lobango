import { Hono } from "hono";
import { adminCheck } from "../middleware/adminAuth";
import { adminLogin } from "./admin/auth/adminLogin";
import { adminLogout } from "./admin/auth/adminLogout";
import updateBookingStatus from "./admin/booking/updateBookingStatus";
import viewBookings from "./admin/booking/viewBookings";
import { downloadData } from "./admin/downLoadData";
import { updateOrderStatus } from "./admin/orders/updateOrderStatus";
import { viewOrders } from "./admin/orders/viewOrders";
import { setNewBookingPermission } from "./admin/permissions/setNewBookingPermission";
import { setNewOrderPermission } from "./admin/permissions/setNewOrderPermission";
import verifyAdmin from "./admin/auth/verifyAdmin";

const adminRouter = new Hono();

adminRouter.post("/login", adminLogin);
adminRouter.post("/logout", adminLogout);
adminRouter.get("/verify", adminCheck, verifyAdmin);

adminRouter.get("/orders", adminCheck, viewOrders);
adminRouter.post("/order/update-status", adminCheck, updateOrderStatus);

adminRouter.get("/bookings", adminCheck, viewBookings);
adminRouter.post("/booking/update-status", adminCheck, updateBookingStatus);

adminRouter.post(
  "/permission/update/new-orders",
  adminCheck,
  setNewOrderPermission,
);
adminRouter.post(
  "/permission/update/new-bookings",
  adminCheck,
  setNewBookingPermission,
);

adminRouter.get("/download-data", adminCheck, downloadData);
export default adminRouter;
