export const API_TAGS = {
  ADMIN: {
    AUTH: "Admin Auth",
    ORDER: "Admin Orders",
    BOOKING: "Admin Bookings",
    PERMISSION: "Admin Permissions",
  },
  CLIENT: {
    ORDER: "Client Orders",
    BOOKING: "Client Bookings",
    PERMISSION: "Client Permissions",
  },
  PAYMENTS: "Payments",
} as const;

type ExtractTagValues<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? { [K in keyof T]: ExtractTagValues<T[K]> }[keyof T]
    : never;

export type ApiTag = ExtractTagValues<typeof API_TAGS>;

const descriptions: Record<ApiTag, string> = {
  [API_TAGS.ADMIN.AUTH]: "Admin login, logout, and session verification.",
  [API_TAGS.ADMIN.ORDER]: "View and update customer orders (admin only).",
  [API_TAGS.ADMIN.BOOKING]: "View and update table reservations (admin only).",
  [API_TAGS.ADMIN.PERMISSION]:
    "Toggle order/booking availability (admin only).",

  [API_TAGS.CLIENT.ORDER]: "Placing and viewing customer orders.",
  [API_TAGS.CLIENT.BOOKING]: "Placing and viewing table reservations.",
  [API_TAGS.CLIENT.PERMISSION]:
    "Check whether ordering/booking is currently open.",

  [API_TAGS.PAYMENTS]: "Razorpay order creation and payment verification.",
};

export const API_TAG_DEFINITIONS = Object.entries(descriptions).map(
  ([name, description]) => ({
    name: name as ApiTag,
    description,
  })
);

export const API_TAG_GROUPS = [
  {
    name: "Admin",
    tags: [
      API_TAGS.ADMIN.AUTH,
      API_TAGS.ADMIN.ORDER,
      API_TAGS.ADMIN.BOOKING,
      API_TAGS.ADMIN.PERMISSION,
    ],
  },
  {
    name: "Client",
    tags: [
      API_TAGS.CLIENT.ORDER,
      API_TAGS.CLIENT.BOOKING,
      API_TAGS.CLIENT.PERMISSION,
    ],
  },
  {
    name: "Payments",
    tags: [API_TAGS.PAYMENTS],
  },
];
