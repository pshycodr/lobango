import { client } from "@/lib/orpc";
import type { SubmitStatus } from "@/types/booking";
import type {
  CreateBookingRequest,
  CreateBookingResponse,
} from "@lobango/contracts/bookings";
import { useCallback, useEffect, useState } from "react";
import {
  copyToClipboard,
  getBookingErrorMessage,
  prepareBookingData,
} from "../utils/bookingUtils";

export interface UseBookingReturn {
  formData: CreateBookingRequest;
  startDate: Date | null;
  isSubmitting: boolean;
  submitStatus: SubmitStatus;
  showPopup: boolean;
  copied: boolean;
  isFormValid: boolean;
  isBookingAllowed: boolean | null;
  handleDateChange: (date: Date | null) => void;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCopy: (text: string) => Promise<void>;
  closePopup: () => void;
}

export function useBooking(): UseBookingReturn {
  const [formData, setFormData] = useState<CreateBookingRequest>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    numberOfPeople: 0,
    date: "",
    time: "10:00am",
    message: "",
  });

  console.log(formData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isBookingAllowed, setIsBookingAllowed] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    const fetchPermission = async () => {
      try {
        const response = await client.permission.get.newBooking();
        if (!cancelled) {
          setIsBookingAllowed(response.newBooking);
        }
      } catch (error) {
        console.error("Failed to fetch booking permission:", error);
        if (!cancelled) {
          setIsBookingAllowed(false);
        }
      }
    };

    fetchPermission();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      numberOfPeople: 0,
      date: "",
      time: "10:00am",
      message: "",
    });
    setStartDate(null);
  }, []);

  const closePopup = useCallback(() => {
    setShowPopup(false);
    setSubmitStatus({
      type: null,
      message: "",
    });
    setCopied(false);
  }, []);

  const handleDateChange = useCallback((date: Date | null) => {
    if (!date) return;

    setStartDate(date);
    setFormData((prev) => ({
      ...prev,
      date: date.toISOString().split("T")[0],
    }));
  }, []);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      console.log(name, value);

      setFormData((prev) => ({
        ...prev,
        [name]: name === "numberOfPeople" ? Number(value[0]) : value,
      }));
    },
    []
  );

  const handleCopy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isBookingAllowed !== true) {
        setSubmitStatus({
          type: "error",
          message: "Sorry, bookings are currently closed.",
        });
        setShowPopup(true);
        return;
      }

      setIsSubmitting(true);

      try {
        const bookingData = prepareBookingData(formData);
        const response: CreateBookingResponse =
          await client.booking.createBooking(bookingData);

        setSubmitStatus({
          type: "success",
          message: "Booking request placed! We'll contact you soon.",
          bookingId: response.bookingId,
        });
        resetForm();
      } catch (error: unknown) {
        console.error("Booking error:", error);
        setSubmitStatus({
          type: "error",
          message: getBookingErrorMessage(error),
        });
      } finally {
        setIsSubmitting(false);
        setShowPopup(true);
      }
    },
    [formData, isBookingAllowed, resetForm]
  );

  const isFormValid =
    formData.customerName.trim().length > 0 &&
    formData.customerPhone.trim().length >= 8 &&
    formData.customerEmail.trim().length > 0 &&
    formData.numberOfPeople > 0 &&
    formData.date.trim().length > 0 &&
    formData.time.trim().length > 0;

  return {
    formData,
    startDate,
    isSubmitting,
    submitStatus,
    showPopup,
    copied,
    isFormValid,
    isBookingAllowed,
    handleDateChange,
    handleInputChange,
    handleSubmit,
    handleCopy,
    closePopup,
  };
}
