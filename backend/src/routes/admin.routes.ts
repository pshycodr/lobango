import { Hono } from "hono";
import { viewOrders } from "./admin/viewOrders";
import { adminCheck } from "../middleware/adminAuth";
import { adminLogin } from "./admin/adminLogin";
import { adminLogout } from "./admin/adminLogout";
import { updateOrderStatus } from "./admin/updateOrderStatus";


const adminRouter = new Hono()

adminRouter.post('/login', adminLogin)
adminRouter.post('/logout', adminLogout)

adminRouter.get("/orders", adminCheck, viewOrders)
adminRouter.patch("/orders/update-status", adminCheck, updateOrderStatus)

export default adminRouter