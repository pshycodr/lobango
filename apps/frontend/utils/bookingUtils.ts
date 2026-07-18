import { BookingResponse, FormData } from "@/types/bookings";

export const getErrorMessage = (
  response: any,
  result: BookingResponse,
): string => {
  if (response.status === 409) {
    return "You already have a booking with this phone number.";
  } else if (response.status === 400 && result.issues) {
    const validationErrors = result.issues
      .map((issue: any) => issue.message)
      .join(", ");
    return `Please check: ${validationErrors}`;
  }
  return result.error || "Something went wrong. Please try again.";
};

export const prepareBookingData = (formData: FormData) => ({
  name: formData.name,
  phone: formData.phone,
  email: formData.email,
  peoples: formData.person.split("-")[0],
  ocassion: formData.message || "N/A",
  date: formData.date,
  time: formData.time,
});

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy: ", err);
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
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
  (_, index) => `${index + 1}-person`,
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
  time.replace(" : ", ":").replace(" ", "").toLowerCase(),
);
