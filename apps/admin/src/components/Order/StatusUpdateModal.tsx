import type { OrderStatus } from "@lobango/contracts/enums";
import { X } from "lucide-react";
import { useState } from "react";
import OrderStatusBadge from "./OrderStatusBadge";

export interface StatusUpdateModalProps {
  currentStatus: OrderStatus | string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newStatus: OrderStatus) => void;
}

export function StatusUpdateModal({
  currentStatus,
  isOpen,
  onClose,
  onUpdate,
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    (currentStatus as OrderStatus) || "pending"
  );

  const statuses: Array<{
    key: OrderStatus;
    label: string;
    description: string;
  }> = [
    {
      key: "pending",
      label: "Pending",
      description: "Order received, waiting for confirmation",
    },
    {
      key: "accepted",
      label: "Accepted",
      description: "Order confirmed and being prepared",
    },
    {
      key: "out_for_delivery",
      label: "Out for Delivery",
      description: "Order is on the way to customer",
    },
    {
      key: "delivered",
      label: "Delivered",
      description: "Order successfully delivered",
    },
    {
      key: "canceld",
      label: "Cancelled",
      description: "Order cancelled",
    },
    {
      key: "rejected",
      label: "Rejected",
      description: "Order rejected",
    },
  ];

  const handleUpdate = () => {
    onUpdate(selectedStatus);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--black-alpha-80) p-4">
      <div className="w-full max-w-md rounded-xl border border-(--eerie-black-4) bg-(--eerie-black-1)">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-(--white)">
              Update Order Status
            </h3>
            <button
              onClick={onClose}
              className="text-(--quick-silver) transition-colors hover:text-(--white)"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6 space-y-3">
            {statuses.map((status) => (
              <label
                key={status.key}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                  selectedStatus === status.key
                    ? "border-(--gold-crayola) bg-(--gold-crayola)/10"
                    : "border-(--eerie-black-4) hover:border-(--eerie-black-3)"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status.key}
                  checked={selectedStatus === status.key}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as OrderStatus)
                  }
                  className="mt-1 text-(--gold-crayola) focus:ring-(--gold-crayola)"
                />
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <OrderStatusBadge status={status.key} disabled={false} />
                  </div>
                  <p className="text-sm text-(--quick-silver)">
                    {status.description}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-(--eerie-black-4) px-4 py-2.5 text-(--quick-silver) transition-all hover:border-(--eerie-black-3) hover:text-(--white)"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="hover:bg-opacity-90 flex-1 rounded-lg bg-(--gold-crayola) px-4 py-2.5 font-medium text-(--smoky-black-1) transition-all"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusUpdateModal;
