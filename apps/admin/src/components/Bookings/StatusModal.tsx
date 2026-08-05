import { X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import type { Booking, StatusOption } from "../../types/bookings";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onStatusChange: (
    bookingId: string,
    newStatus: "pending" | "accepted" | "rejected",
  ) => void;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  booking,
  onStatusChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<
    "pending" | "accepted" | "rejected"
  >("pending");
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      onStatusChange(booking.booking_id, selectedStatus);
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
    { label: "Rejected", value: "rejected" },
  ];

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-[var(--black-alpha-80)] flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--eerie-black-1)] border border-[var(--eerie-black-4)] rounded-xl p-6 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[var(--white)]">
            Change Booking Status
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--eerie-black-3)] rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-[var(--quick-silver)]" />
          </button>
        </div>

        {/* Booking Info */}
        <div className="mb-6 p-4 bg-[var(--eerie-black-2)] rounded-lg">
          <div className="text-[var(--white)] font-medium mb-2">
            #{booking.booking_id}
          </div>
          <div className="text-[var(--quick-silver)] text-sm mb-1">
            {booking.customer_name}
          </div>
          <div className="text-[var(--quick-silver)] text-sm">
            {new Date(booking.date).toLocaleDateString()} at {booking.time}
          </div>
        </div>

        {/* Status Selection */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[var(--white)] text-sm font-medium mb-3">
              Select New Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-3 bg-[var(--eerie-black-2)] border border-[var(--eerie-black-4)] rounded-lg hover:bg-[var(--eerie-black-3)] cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={selectedStatus === option.value}
                    onChange={(e) =>
                      setSelectedStatus(
                        e.target.value as "pending" | "accepted" | "rejected",
                      )
                    }
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedStatus === option.value
                        ? "border-[var(--gold-crayola)] bg-[var(--gold-crayola)]"
                        : "border-[var(--quick-silver)]"
                    }`}
                  >
                    {selectedStatus === option.value && (
                      <Check
                        size={10}
                        className="text-[var(--smoky-black-1)]"
                      />
                    )}
                  </div>
                  <span className="text-[var(--white)] capitalize">
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
              className="flex-1 px-4 py-2 bg-[var(--eerie-black-3)] text-[var(--white)] rounded-lg hover:bg-[var(--eerie-black-4)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || selectedStatus === booking.status}
              onSubmit={handleSubmit}
              className="flex-1 px-4 py-2 bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] rounded-lg hover:bg-[var(--gold-crayola)]/90 transition-colors disabled:opacity-50 font-medium"
            >
              {isLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusChangeModal;
