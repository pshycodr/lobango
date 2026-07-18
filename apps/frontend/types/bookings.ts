export interface BookingResponse {
  success: boolean;
  booking_id?: string;
  error?: string;
  issues?: any[];
}

export interface FormData {
  name: string;
  phone: string;
  email: string;
  person: string;
  date: string;
  time: string;
  message: string;
}

export interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
  bookingId?: string;
}
