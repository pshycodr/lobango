import api from "@/lib/axios";
import {
  Booking,
  BookingResponse,
  SubmitStatus,
} from "@lobango/contracts/bookings";
import type { GetNewBookingPermissionResponse } from "@lobango/contracts/permissions";
import { useEffect, useState } from "react";
import {
  copyToClipboard,
  getErrorMessage,
  prepareBookingData,
} from "../utils/bookingUtils";
import { client } from "@/lib/orpc";

export const useBooking = () => {
  const [formData, setFormData] = useState<Booking>({
    name: "",
    phone: "",
    email: "",
    person: "1-person",
    date: "",
    time: "10:00am",
    message: "",
  });

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
    const fetchPermission = async () => {
      try {
        const res = await client.permission.get.newBooking();
        setIsBookingAllowed(res.new_bookings);
      } catch (error) {
        console.error("Failed to fetch booking permission:", error);
        setIsBookingAllowed(false);
      }
    };
    fetchPermission();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      person: "1-person",
      date: "",
      time: "10:00am",
      message: "",
    });
    setStartDate(null);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSubmitStatus({ type: null, message: "" });
    setCopied(false);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setStartDate(date);
    setFormData((prev) => ({
      ...prev,
      date: date.toISOString().split("T")[0],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBookingAllowed) {
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
      const response = await api.post("/api/v1/client/booking", bookingData);
      const result: BookingResponse = response.data;

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: "Booking Request placed! We'll contact you soon.",
          bookingId: result.booking_id,
        });
        resetForm();
      } else {
        const errorMessage = getErrorMessage(response, result);
        setSubmitStatus({
          type: "error",
          message: errorMessage,
        });
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      if (error.response?.data) {
        const errorMessage = getErrorMessage(
          error.response,
          error.response.data
        );
        setSubmitStatus({
          type: "error",
          message: errorMessage,
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: "Network error. Please check your connection and try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
      setShowPopup(true);
    }
  };

  const isFormValid =
    formData.name && formData.phone && formData.email && formData.date;

  return {
    formData,
    isSubmitting,
    submitStatus,
    showPopup,
    copied,
    startDate,
    isFormValid,
    isBookingAllowed,
    handleDateChange,
    handleInputChange,
    handleSubmit,
    handleCopy,
    closePopup,
  };
};
