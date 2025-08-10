import { Hono } from 'hono'
import { cors } from 'hono/cors'
import orderRouter from './routes/clients.routes'
import adminRouter from './routes/admin.routes'
import clientRouter from './routes/clients.routes'
import paymentRouter from './routes/payments.routes'
import permissionsRouter from './routes/permissons.route'

const app = new Hono()

const allowedOrigins = [
  'https://adminlobango.vercel.app',
  'https://lobango.vercel.app',
  'https://admin.lobango.in',
  'https://lobango.in',
  'http://localhost:3000',
  'http://localhost:5173',
]

app.use('*', cors({
  origin: (origin) => {
    if (!origin) return origin
    return allowedOrigins.includes(origin) ? origin : ''
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/', (c) => c.text('Hello Hono!'))

app.route("/api/v1/client", clientRouter)
app.route("/api/v1/admin", adminRouter)
app.route("/api/v1/payment", paymentRouter)
app.route("/api/v1/permission", permissionsRouter )

export default app
