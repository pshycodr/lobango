import type { BookingStatus } from "@lobango/contracts/enums";
import React from "react";

export interface StatusBadgeProps {
  status: BookingStatus;
  onClick: (e: React.MouseEvent) => void;
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const getStatusStyles = (statusKey: string) => {
    switch (statusKey) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30";
      case "accepted":
      case "confirmed":
        return "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30";
      case "rejected":
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30";
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${getStatusStyles(
        status
      )} cursor-pointer capitalize hover:scale-105`}
      title="Click to change status"
    >
      {status}
    </button>
  );
}

export default StatusBadge;
