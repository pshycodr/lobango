import { useAdminAuth } from "@/hooks/useAdminAuth";
import BookingsAdminPage from "@/pages/Bookings";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/Bookings")({
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

  return <BookingsAdminPage />;
}

export default RouteComponent;
