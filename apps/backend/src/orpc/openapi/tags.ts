export const API_TAGS = {
  ORDERS: "Orders",
  BOOKINGS: "Bookings",
  PERMISSIONS: "Permissions",
  ADMIN: "Admin",
  PAYMENTS: "Payments",
} as const;

export type ApiTag = (typeof API_TAGS)[keyof typeof API_TAGS];

export const API_TAG_DEFINITIONS: { name: ApiTag; description: string }[] = [
  {
    name: API_TAGS.ORDERS,
    description: "Placing, viewing, and cancelling customer orders.",
  },
  { name: API_TAGS.BOOKINGS, description: "Table reservation management." },
  {
    name: API_TAGS.PERMISSIONS,
    description: "Feature flags controlling order/booking availability.",
  },
  {
    name: API_TAGS.ADMIN,
    description: "Internal admin-only operations, requires authentication.",
  },
  {
    name: API_TAGS.PAYMENTS,
    description: "Razorpay order creation and payment verification.",
  },
];
