// Bookings
export interface GetNewBookingPermissionResponse {
  new_bookings: boolean;
}

export interface SetNewBookingPermissionRequest {
  value: boolean;
}

export interface SetNewBookingPermissionResponse {
  new_bookings: boolean;
}

// Orders
export interface GetNewOrderPermissionResponse {
  new_orders: boolean;
}

export interface SetNewOrderPermissionRequest {
  value: boolean;
}

export interface SetNewOrderPermissionResponse {
  new_orders: boolean;
}
