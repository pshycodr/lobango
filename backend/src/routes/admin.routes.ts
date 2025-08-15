import { Hono } from "hono";
import { viewOrders } from "./admin/viewOrders";
import { adminCheck } from "../middleware/adminAuth";
import { adminLogin } from "./admin/adminLogin";
import { adminLogout } from "./admin/adminLogout";
import { updateOrderStatus } from "./admin/updateOrderStatus";
import viewBookings from "./admin/viewBookings";
import updateBookingStatus from "./admin/updateBookingStatus";
import verifyAdmin from "./admin/verifyAdmin";
import { setNewOrderPermission } from "./admin/setNewOrderPermission";
import { setNewBookingPermission } from "./admin/setNewBookingPermission";
import { downloadData } from "./admin/downLoadData";


const adminRouter = new Hono()

adminRouter.post('/login', adminLogin)
adminRouter.post('/logout', adminLogout)
adminRouter.get('/verify', adminCheck, verifyAdmin)

adminRouter.get("/orders", adminCheck, viewOrders)
adminRouter.post("/order/update-status", adminCheck, updateOrderStatus)

adminRouter.get("/bookings", adminCheck, viewBookings)
adminRouter.post("/booking/update-status", adminCheck, updateBookingStatus)

adminRouter.post("/permission/update/new-orders", adminCheck, setNewOrderPermission)
adminRouter.post("/permission/update/new-bookings", adminCheck, setNewBookingPermission)

adminRouter.get("/download-data", adminCheck, downloadData)
export default adminRouter