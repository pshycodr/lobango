import { create } from 'zustand'
import type { OrderItem } from '../../types/orders'

type Order = {
  orderId: string
  name: string
  phone: string
  address: string
  total: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
  items: OrderItem[]
}

type OrdersState = {
  orders: Order[]
  setOrders: (orders: Order[]) => void
  clearOrders: () => void
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  clearOrders: () => set({ orders: [] }),
}))
