import type { BookingStatus } from "@lobango/contracts/enums";

export interface StatusOption {
  label: string;
  value: BookingStatus;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface StatusCounts {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}
