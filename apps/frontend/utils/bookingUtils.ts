import { CreateBookingRequest } from "@lobango/contracts/bookings";

type ORPCErrorLike = {
  code?: string;
  status?: number;
  message?: string;
  data?: unknown;
  issues?: Array<{
    message?: string;
    path?: PropertyKey[];
  }>;
};

const isORPCErrorLike = (error: unknown): error is ORPCErrorLike => {
  return typeof error === "object" && error !== null;
};

export const getBookingErrorMessage = (error: unknown): string => {
  if (!isORPCErrorLike(error)) {
    return "Network error. Please check your connection and try again.";
  }

  if (error.code === "CONFLICT" || error.status === 409) {
    return "You already have a booking with this phone number.";
  }

  if (error.code === "BAD_REQUEST" || error.status === 400) {
    if (Array.isArray(error.issues) && error.issues.length > 0) {
      const validationErrors = error.issues
        .map((issue) => issue.message?.trim())
        .filter((message): message is string => Boolean(message))
        .join(", ");

      if (validationErrors) {
        return `Please check: ${validationErrors}`;
      }
    }

    return error.message || "Invalid booking details. Please check your input.";
  }

  if (error.code === "UNAUTHORIZED" || error.status === 401) {
    return "You are not authorized to make this booking.";
  }

  if (error.code === "FORBIDDEN" || error.status === 403) {
    return "You are not allowed to make this booking.";
  }

  if (error.code === "NOT_FOUND" || error.status === 404) {
    return "The booking service could not be found. Please try again later.";
  }

  if (error.code === "INTERNAL_SERVER_ERROR" || error.status === 500) {
    return "Server error. Please try again later.";
  }

  if (error.code === "TIMEOUT" || error.status === 408) {
    return "The request timed out. Please try again.";
  }

  if (error.status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  return "Something went wrong. Please try again.";
};

export const prepareBookingData = (
  formData: CreateBookingRequest
): CreateBookingRequest => ({
  customerName: formData.customerName.trim(),
  customerPhone: formData.customerPhone.trim(),
  customerEmail: formData.customerEmail.trim().toLowerCase(),
  numberOfPeople: formData.numberOfPeople,
  date: formData.date.trim(),
  time: formData.time.trim(),
  message: formData.message?.trim() || "N/A",
});

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy using Clipboard API:", error);
  }

  try {
    const textArea = document.createElement("textarea");

    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    const copied = document.execCommand("copy");

    document.body.removeChild(textArea);

    return copied;
  } catch (error) {
    console.error("Failed to copy using fallback:", error);
    return false;
  }
};

export const personOptions = [
  "1 Person",
  "2 Person",
  "3 Person",
  "4 Person",
  "5 Person",
  "6 Person",
  "7 Person",
];

export const personValues = personOptions.map(
  (_, index) => `${index + 1}-person`
);

export const timeOptions = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
];

export const timeValues = timeOptions.map((time) =>
  time.replace(" : ", ":").replace(" ", "").toLowerCase()
);
