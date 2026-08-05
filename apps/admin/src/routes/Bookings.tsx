import { createFileRoute, useNavigate } from "@tanstack/react-router";
import BookingsAdminPage from "../pages/Bookings";
import { useEffect } from "react";
import api from "../lib/axios";

export const Route = createFileRoute("/Bookings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await api.get("/api/v1/admin/verify");

        if (!res.data.success) {
          navigate({ to: "/signin" });
        }
      } catch (error) {
        navigate({ to: "/signin" });
      }
    };

    checkAdmin();
  }, []);

  return <BookingsAdminPage />;
}
