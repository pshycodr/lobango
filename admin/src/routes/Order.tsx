import { createFileRoute, useNavigate } from '@tanstack/react-router'
import OrderDetails from '../pages/Order'
import { useEffect } from 'react'
import api from '../lib/axios'

export const Route = createFileRoute('/Order')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdmin = async () => {
        try {
            const res = await api.get("/api/v1/admin/verify")
            
            if (!res.data.success) {
                navigate({ to: "/signin" })
            }
        } catch (error) {
            navigate({ to: "/signin" })
        }
    }

    checkAdmin()

  }, [])

  return <OrderDetails />
}
