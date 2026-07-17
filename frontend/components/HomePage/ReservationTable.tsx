'use client';

import { useBooking } from "@/hooks/useBookings";
import { ContactInfo } from "../ReservationForm/ContactInfo";
import { ReservationForm } from "../ReservationForm/ReservationForm";
import { StatusPopup } from "../ReservationForm/StatusPopup";

const ReservationSection = () => {
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

  return (
    <>
      <section className="relative" id="reserv">
        <div className="container mx-auto px-4">
          <div className="bg-[var(--smoky-black-2)] -mt-[270px] lg:grid lg:grid-cols-[1fr_0.5fr] overflow-hidden">

            <ReservationForm
              formData={formData}
              startDate={startDate}
              isSubmitting={isSubmitting}
              // @ts-ignore
              isFormValid={isFormValid}
              // @ts-ignore
              isBookingAllowed={isBookingAllowed}
              onInputChange={handleInputChange}
              onDateChange={handleDateChange}
              onSubmit={handleSubmit}
            />

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
};

export default ReservationSection;
