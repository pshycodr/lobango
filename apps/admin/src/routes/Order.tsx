import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminOrderDetails from "@/pages/Order";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/Order")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { verifyAuth } = useAdminAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      const isAuthenticated = await verifyAuth();
      if (!isAuthenticated) {
        navigate({ to: "/signin" });
      }
    };

    checkAdmin();
  }, [navigate, verifyAuth]);

  return <AdminOrderDetails />;
}

export default RouteComponent;
