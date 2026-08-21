"use client";

import { useBooking } from "@/hooks/useBooking";
import {
  personOptions,
  personValues,
  timeOptions,
  timeValues,
} from "@/utils/bookingUtils";
import { Clock, User } from "lucide-react";
import { Forum } from "next/font/google";
import { ContactInfo } from "../ReservationForm/ContactInfo";
import {
  DatePickerInput,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "../ReservationForm/FormInputs";
import { StatusPopup } from "../ReservationForm/StatusPopup";
import { SubmitButton } from "../ReservationForm/SubmitButton";
const forum = Forum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-forum",
});
export function ReservationSection() {
  const {
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
  } = useBooking();

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  return (
    <>
      <section className="relative" id="reserv">
        <div className="container mx-auto px-4">
          <div className="-mt-67.5 overflow-hidden bg-(--smoky-black-2) lg:grid lg:grid-cols-[1fr_0.5fr]">
            <form className="p-10 lg:p-16" onSubmit={handleSubmit}>
              {isBookingAllowed === false && (
                <div className="mb-5 flex items-center justify-center gap-3 rounded-md border-2 border-red-500 p-8 text-center text-xl font-semibold tracking-tighter text-red-500">
                  <p>Bookings are currently closed. Please check back later.</p>
                </div>
              )}

              <h2
                className={`text-3xl text-white ${forum.className} mb-6 text-center`}
              >
                Online Reservation
              </h2>

              <p className="mb-10 text-center text-amber-50">
                Booking request{" "}
                <a
                  href="tel:+911234567890"
                  className="text-(--gold-crayola) underline"
                >
                  +91 1234567890
                </a>{" "}
                or fill out the order form
              </p>

              <div className="mb-5 grid gap-5 md:grid-cols-2">
                <TextInput
                  name="customerName"
                  placeholder="Your Name"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
                <TextInput
                  name="customerPhone"
                  placeholder="Phone Number"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  type="tel"
                  required
                  disabled={isSubmitting}
                  minLength={8}
                />
              </div>

              <div className="mb-5">
                <TextInput
                  name="customerEmail"
                  placeholder="Your Email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  type="email"
                  required
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>

              <div className="mb-5 grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <SelectInput
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  options={personOptions}
                  optionValues={personValues}
                  icon={User}
                  disabled={isSubmitting}
                />

                <DatePickerInput
                  selected={startDate}
                  onChange={handleDateChange}
                  minDate={today}
                  maxDate={maxDate}
                  disabled={isSubmitting}
                />

                <SelectInput
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  options={timeOptions}
                  optionValues={timeValues}
                  icon={Clock}
                  disabled={isSubmitting}
                />
              </div>

              <TextAreaInput
                name="message"
                placeholder="Special occasion or message (optional)"
                value={formData.message}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />

              <SubmitButton
                isSubmitting={isSubmitting}
                isFormValid={isFormValid}
              />
            </form>

            <ContactInfo />
          </div>
        </div>
      </section>

      {showPopup && (
        <StatusPopup
          submitStatus={submitStatus}
          copied={copied}
          onClose={closePopup}
          onCopy={handleCopy}
        />
      )}
    </>
  );
}

export default ReservationSection;
