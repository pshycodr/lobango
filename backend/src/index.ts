import { Hono } from 'hono'
import { cors } from 'hono/cors'
import orderRouter from './routes/clients.routes'
import adminRouter from './routes/admin.routes'
import clientRouter from './routes/clients.routes'
import paymentRouter from './routes/payments.routes'

const app = new Hono()
app.use('*', cors({
  origin: 'http://localhost:5173',           // ✅ Frontend dev server
  credentials: true,                         // ✅ Allow cookies / credentials
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
app.get('/', (c) => {
  return c.text('Hello Hono!')
})



app.route("/api/v1/client", clientRouter)
app.route("/api/v1/admin", adminRouter)
app.route("/api/v1/payment", paymentRouter)


export default app 