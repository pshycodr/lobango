import { customAlphabet } from "nanoid";

export const generateOrderId = () => {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
  return `ORD_${nanoid()}`;
};

export const generateBookingId = () => {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
  return `BK_${nanoid()}`;
};
