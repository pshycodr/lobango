import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminOrdersView from "@/pages/Orders";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
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

  return <AdminOrdersView />;
}

export default RouteComponent;
