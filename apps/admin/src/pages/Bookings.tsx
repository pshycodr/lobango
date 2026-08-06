import { Filter, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import BookingCard from "../components/Bookings/BookingCard";
import FilterDropdown from "../components/Bookings/FilterDropdown";
import StatusChangeModal from "../components/Bookings/StatusModal";
import type { Booking, FilterOption, StatusCounts } from "../types/bookings";
import api from "../lib/axios";
import LoadingSpinner from "../components/Common/Loader";

const BookingsAdminPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await api.get("/api/v1/admin/bookings");
        const data = await response.data;
        console.log();

        setBookings(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (statusFilter) {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.customer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.customer_email
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, searchTerm]);

  const handleCardClick = (booking: Booking): void => {
    console.log("Clicked booking:", booking);
    // Navigate to booking details page or open modal
  };

  const handleStatusClick = (booking: Booking, e: React.MouseEvent): void => {
    e.stopPropagation(); // Prevent card click
    setSelectedBooking(booking);
    setIsStatusModalOpen(true);
  };

  const handleStatusChange = async (
    bookingId: string,
    newStatus: "pending" | "accepted" | "rejected"
  ) => {
    try {
      console.log(bookingId);
      const res = await api.post("/api/v1/admin/booking/update-status", {
        booking_id: bookingId,
        status: newStatus,
      });

      if (!res.data.success) throw new Error();

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.booking_id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.log(error);
      alert("faild to update status. Try again later");
    }
  };

  const getStatusCounts = (): StatusCounts => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      accepted: bookings.filter((b) => b.status === "accepted").length,
      rejected: bookings.filter((b) => b.status === "rejected").length,
    };
  };

  const statusCounts = getStatusCounts();

  const statusOptions: FilterOption[] = [
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--smoky-black-1)">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--smoky-black-1) text-(--white)">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-(--white) sm:text-3xl">
            Table Bookings
          </h1>
          <p className="text-(--quick-silver)">
            Manage and track restaurant table reservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-4">
            <div className="mb-1 text-2xl font-bold text-(--white)">
              {statusCounts.total}
            </div>
            <div className="text-sm text-(--quick-silver)">Total Bookings</div>
          </div>
          <div className="rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-4">
            <div className="mb-1 text-2xl font-bold text-yellow-400">
              {statusCounts.pending}
            </div>
            <div className="text-sm text-(--quick-silver)">Pending</div>
          </div>
          <div className="rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-4">
            <div className="mb-1 text-2xl font-bold text-green-400">
              {statusCounts.accepted}
            </div>
            <div className="text-sm text-(--quick-silver)">Accepted</div>
          </div>
          <div className="rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-2) p-4">
            <div className="mb-1 text-2xl font-bold text-red-400">
              {statusCounts.rejected}
            </div>
            <div className="text-sm text-(--quick-silver)">Rejected</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={20}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-(--quick-silver)"
              />
              <input
                type="text"
                placeholder="Search by name, booking ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-2) py-3 pr-4 pl-10 text-(--white) placeholder-(--quick-silver) focus:border-(--gold-crayola)/50 focus:ring-1 focus:ring-(--gold-crayola)/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={
                statusFilter
                  ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
                  : ""
              }
              onChange={setStatusFilter}
              icon={Filter}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-(--quick-silver)">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-lg text-(--quick-silver)">
              No bookings found
            </div>
            <p className="text-sm text-(--quick-silver)/70">
              {bookings.length === 0
                ? "There are no bookings to display."
                : "Try adjusting your filters or search terms."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={handleCardClick}
                onStatusClick={handleStatusClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status Change Modal */}
      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        booking={selectedBooking}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default BookingsAdminPage;
