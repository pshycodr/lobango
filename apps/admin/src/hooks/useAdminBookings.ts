import { admin } from "@/lib/orpc";
import type { StatusCounts } from "@/types/bookings";
import type { Booking } from "@lobango/contracts/bookings";
import type { BookingStatus } from "@lobango/contracts/enums";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface UseAdminBookingsReturn {
  bookings: Booking[];
  filteredBookings: Booking[];
  statusFilter: string;
  searchTerm: string;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  statusCounts: StatusCounts;
  setStatusFilter: (status: string) => void;
  setSearchTerm: (term: string) => void;
  handleStatusChange: (
    bookingId: string,
    status: BookingStatus
  ) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useAdminBookings(): UseAdminBookingsReturn {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) {
        setIsLoading(true);
      }
      setError(null);

      const res = await admin.booking.getAllBookings({});
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings via oRPC:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      if (!isBackground) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchBookings(false);

    const intervalId = setInterval(() => {
      fetchBookings(true);
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [fetchBookings]);

  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    if (statusFilter) {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((booking) => {
        return (
          booking.customerName.toLowerCase().includes(term) ||
          booking.bookingId.toLowerCase().includes(term) ||
          booking.customerEmail.toLowerCase().includes(term) ||
          booking.customerPhone.includes(term)
        );
      });
    }

    return filtered;
  }, [bookings, statusFilter, searchTerm]);

  const handleStatusChange = useCallback(
    async (bookingId: string, newStatus: BookingStatus): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);
      try {
        const res = await admin.booking.updateBookingStatus({
          bookingId,
          status: newStatus,
        });

        if (res.success) {
          setBookings((prev) =>
            prev.map((b) =>
              b.bookingId === bookingId ? { ...b, status: newStatus } : b
            )
          );
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error updating booking status via oRPC:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update booking status"
        );
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const statusCounts = useMemo<StatusCounts>(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      accepted: bookings.filter((b) => b.status === "accepted").length,
      rejected: bookings.filter((b) => b.status === "rejected").length,
    };
  }, [bookings]);

  return {
    bookings,
    filteredBookings,
    statusFilter,
    searchTerm,
    isLoading,
    isUpdating,
    error,
    statusCounts,
    setStatusFilter,
    setSearchTerm,
    handleStatusChange,
    refetch: () => fetchBookings(false),
  };
}
