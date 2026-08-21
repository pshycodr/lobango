import type { StatusOption } from "@/types/bookings";
import type { Booking } from "@lobango/contracts/bookings";
import type { BookingStatus } from "@lobango/contracts/enums";
import { Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";

export interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => void;
}

export function StatusChangeModal({
  isOpen,
  onClose,
  booking,
  onStatusChange,
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<BookingStatus>("pending");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status);
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setIsLoading(true);
    try {
      await onStatusChange(booking.bookingId, selectedStatus);
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions: StatusOption[] = [
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rejected", value: "rejected" },
  ];

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--black-alpha-80) p-4">
      <div className="mx-auto w-full max-w-md rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-1) p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-(--white)">
            Change Booking Status
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-(--eerie-black-3)"
            disabled={isLoading}
          >
            <X size={20} className="text-(--quick-silver)" />
          </button>
        </div>

        {/* Booking Info */}
        <div className="mb-6 rounded-lg bg-(--eerie-black-2) p-4">
          <div className="mb-2 font-medium text-(--white)">
            #{booking.bookingId}
          </div>
          <div className="mb-1 text-sm text-(--quick-silver)">
            {booking.customerName}
          </div>
          <div className="text-sm text-(--quick-silver)">
            {new Date(booking.date).toLocaleDateString()} at {booking.time}
          </div>
        </div>

        {/* Status Selection */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-(--white)">
              Select New Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center rounded-lg border border-(--eerie-black-4) bg-(--eerie-black-2) p-3 transition-colors hover:bg-(--eerie-black-3)"
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as BookingStatus)
                    }
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div
                    className={`mr-3 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      selectedStatus === option.value
                        ? "border-(--gold-crayola) bg-(--gold-crayola)"
                        : "border-(--quick-silver)"
                    }`}
                  >
                    {selectedStatus === option.value && (
                      <Check size={10} className="text-(--smoky-black-1)" />
                    )}
                  </div>
                  <span className="text-(--white) capitalize">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-(--eerie-black-3) px-4 py-2 text-(--white) transition-colors hover:bg-(--eerie-black-4) disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedStatus === booking.status}
              className="flex-1 rounded-lg bg-(--gold-crayola) px-4 py-2 font-medium text-(--smoky-black-1) transition-colors hover:bg-(--gold-crayola)/90 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StatusChangeModal;
