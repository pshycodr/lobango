import { createFileRoute, useNavigate } from '@tanstack/react-router'
import AdminOrdersView from '../pages/Orders'
import { useEffect } from 'react'
import api from '../lib/axios'

export const Route = createFileRoute('/Orders')({
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

  return <AdminOrdersView />
}
