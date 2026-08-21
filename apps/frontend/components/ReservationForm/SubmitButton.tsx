import React from "react";

export interface SubmitButtonProps {
  isSubmitting: boolean;
  isFormValid: boolean;
}

export function SubmitButton({ isSubmitting, isFormValid }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting || !isFormValid}
      className={`group relative z-10 w-full overflow-hidden px-11 py-3 font-bold tracking-[3px] uppercase transition-all duration-500 ${
        isSubmitting || !isFormValid
          ? "cursor-not-allowed bg-gray-500 text-gray-300"
          : "bg-(--gold-crayola) text-black hover:text-white"
      }`}
    >
      {!isSubmitting && (
        <div className="absolute bottom-full left-1/2 -z-10 h-[200%] w-[200%] -translate-x-1/2 rounded-full bg-(--smoky-black-1) transition-all duration-500 group-hover:bottom-[-50%]"></div>
      )}
      <span
        className={`block transition-transform duration-250 ${
          isSubmitting ? "" : "group-hover:-translate-y-10"
        }`}
      >
        {isSubmitting ? "Booking..." : "Book A Table"}
      </span>
      {!isSubmitting && (
        <span className="absolute top-full left-1/2 min-w-max -translate-x-1/2 text-white transition-all duration-250 group-hover:top-1/2 group-hover:-translate-y-1/2">
          Book A Table
        </span>
      )}
    </button>
  );
}
