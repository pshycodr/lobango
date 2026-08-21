import BookingCard from "@/components/Bookings/BookingCard";
import FilterDropdown from "@/components/Bookings/FilterDropdown";
import StatusChangeModal from "@/components/Bookings/StatusModal";
import LoadingSpinner from "@/components/Common/Loader";
import { useAdminBookings } from "@/hooks/useAdminBookings";
import type { FilterOption } from "@/types/bookings";
import type { Booking } from "@lobango/contracts/bookings";
import type { BookingStatus } from "@lobango/contracts/enums";
import { Filter, Search } from "lucide-react";
import React, { useState } from "react";

export function BookingsAdminPage() {
  const {
    bookings,
    filteredBookings,
    statusFilter,
    searchTerm,
    isLoading,
    statusCounts,
    setStatusFilter,
    setSearchTerm,
    handleStatusChange,
  } = useAdminBookings();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleCardClick = (booking: Booking): void => {
    setSelectedBooking(booking);
    setIsStatusModalOpen(true);
  };

  const handleStatusClick = (booking: Booking, e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsStatusModalOpen(true);
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: BookingStatus
  ) => {
    await handleStatusChange(bookingId, newStatus);
  };

  const statusOptions: FilterOption[] = [
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rejected", value: "rejected" },
  ];

  if (isLoading) {
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
        onStatusChange={handleUpdateBookingStatus}
      />
    </div>
  );
}

export default BookingsAdminPage;
